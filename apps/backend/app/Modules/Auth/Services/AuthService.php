<?php

namespace App\Modules\Auth\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Modules\Shared\Responses\ApiResponse;

class AuthService
{
    public function register(array $data)
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'],
            'role' => $data['role'] ?? 'customer',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return ApiResponse::success(
            'User registered successfully',
            [
                'user' => $user,
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
        return ApiResponse::success(
            'Authenticated user',
            $user
        );
    }

    public function logout(User $user)
    {
        $user->tokens()->delete();
        return ApiResponse::success(
            'Logout successful'
        );
    }
}