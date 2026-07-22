<?php

namespace App\Modules\Profile\Services;

use App\Models\User;
use App\Modules\Shared\Responses\ApiResponse;

class ProfileService
{
    public function show(User $user)
    {
        return ApiResponse::success(
            'Profile retrieved successfully',
            [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'language' => $user->language,
                'role' => $user->role,
            ]
        );
    }

    public function update(User $user, array $data)
    {
        $user->update([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'language' => $data['language'],
            'avatar' => $data['avatar'] ?? null,
        ]);

        $user->refresh();

        return ApiResponse::success(
            'Profile updated successfully',
            [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'avatar' => $user->avatar,
                'language' => $user->language,
                'role' => $user->role,
            ]
        );
    }
}