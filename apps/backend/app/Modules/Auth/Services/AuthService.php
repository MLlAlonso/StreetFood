<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use App\Models\Business;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Hash;
use App\Modules\Shared\Responses\ApiResponse;
use App\Modules\Auth\Services\EmailVerificationService;
use App\Models\PasswordResetCode;
use App\Mail\ForgotPasswordMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class AuthService
{
    protected EmailVerificationService $verificationService;

    public function __construct(EmailVerificationService $verificationService)
    {
        $this->verificationService = $verificationService;
    }

    public function register(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'password' => $data['password'],
            'role' => $data['role'],
            'language' => $data['language'],
        ]);

        if ($data['role'] === 'vendor') {
            $business = $user->business()->create([
                'business_type' => $data['business_type'],
                'business_name' => $data['business_name'],
                'logo' => $data['logo'] ?? null,
                'description' => $data['description'] ?? null,
                'latitude' => $data['latitude'] ?? null,
                'longitude' => $data['longitude'] ?? null,
            ]);

            if (!empty($data['menu'])) {
                foreach ($data['menu'] as $dish) {
                    $business->menuItems()->create([
                        'name' => $dish['name'],
                        'description' => $dish['description'] ?? null,
                        'image' => $dish['image'] ?? null,
                    ]);
                }
            }
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return ApiResponse::success(
            'User registered successfully',
            [
                'user' => $user->load('business.categories'),
                'token' => $token,
            ],
            201
        );
    }

    public function login(array $data)
    {
        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return ApiResponse::error(
                'Invalid credentials',
                null,
                401
            );
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        return ApiResponse::success(
            'Login successful',
            [
                'user' => $user,
                'token' => $token,
            ]
        );
    }

    public function me(User $user)
    {
        return ApiResponse::success('Authenticated user', $user);
    }

    public function logout(User $user)
    {
        $user->tokens()->delete();
        return ApiResponse::success('Logout successful');
    }

    public function sendVerificationCode(string $email)
    {
        $this->verificationService->sendCode($email);
        return ApiResponse::success('Verification code sent');
    }

    public function verifyCode(string $email, string $code)
    {
        $valid = $this->verificationService->verify($email, $code);

        if (!$valid) {
            return ApiResponse::error('Invalid verification code');
        }

        return ApiResponse::success('Code verified');
    }

    public function forgotPassword(array $data)
    {
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return ApiResponse::error(
                'User not found',
                null,
                404
            );
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        PasswordResetCode::updateOrCreate(
            [
                'email' => $user->email
            ],
            [
                'code' => $code,
                'expires_at' => now()->addMinutes(10),
            ]
        );

        Mail::to($user->email)->send(new ForgotPasswordMail($code));
        return ApiResponse::success('Code sent');
    }

    public function verifyResetCode(array $data)
    {
        $record = PasswordResetCode::where('email', $data['email'])
            ->where('code', $data['code'])
            ->first();

        if (!$record || now()->gt($record->expires_at)) {
            return ApiResponse::error(
                'Invalid code',
                null,
                422
            );
        }

        return ApiResponse::success(
            'Code verified'
        );
    }

    public function resetPassword(array $data)
    {
        $user = User::where('email', $data['email'])->first();
        $user->update(['password' => bcrypt($data['password']),]);
        PasswordResetCode::where('email', $data['email'])->delete();

        return ApiResponse::success(
            'Password updated'
        );
    }
}
