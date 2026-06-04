<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use App\Models\Business;
use Illuminate\Support\Facades\Hash;
use App\Modules\Shared\Responses\ApiResponse;
use App\Modules\Auth\Services\EmailVerificationService;

class AuthService
{
    protected EmailVerificationService $verificationService;

    public function __construct( EmailVerificationService $verificationService) {
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

            // Categories temporarily disabled
            // because frontend is sending names instead of IDs

            /*
            if (!empty($data['categories'])) {
                $business->categories()->sync($data['categories']);
            }
            */
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
        return ApiResponse::success( 'Authenticated user', $user );
    }

    public function logout(User $user)
    {
        $user->tokens()->delete();
        return ApiResponse::success( 'Logout successful' );
    }

    public function sendVerificationCode( string $email ) {
        $this->verificationService ->sendCode($email);
        return ApiResponse::success('Verification code sent' );
    }

    public function verifyCode( string $email, string $code) {
        $valid = $this->verificationService ->verify( $email, $code);

        if (!$valid) {
            return ApiResponse::error( 'Invalid verification code' );
        }

        return ApiResponse::success( 'Code verified' );
    }
}