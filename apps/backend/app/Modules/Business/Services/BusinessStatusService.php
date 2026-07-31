<?php

namespace App\Modules\Business\Services;

use App\Models\Business;
use Carbon\Carbon;

class BusinessStatusService
{
    public function resolve(Business $business): array
    {
        /*
        |--------------------------------------------------------------------------
        | Sin horario
        |--------------------------------------------------------------------------
        */
        if (!$business->schedule_enabled) {
            return [
                'status' => $business->manual_override === 'open'
                    ? 'open'
                    : 'closed',

                'reason' => 'manual',
                'opens_at' => null,
                'closes_at' => null,
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Con horario
        |--------------------------------------------------------------------------
        */
        $now = now();
        $today = $now->dayOfWeek;
        $hours = $business->hours->firstWhere('day_of_week', $today);

        /*
        |--------------------------------------------------------------------------
        | Día deshabilitado
        |--------------------------------------------------------------------------
        */
        if (!$hours || !$hours->enabled) {
            return [
                'status' => 'closed',
                'reason' => 'schedule',
                'opens_at' => null,
                'closes_at' => null,
            ];
        }

        $open = Carbon::parse($hours->open_time);
        $close = Carbon::parse($hours->close_time);

        /*
        |--------------------------------------------------------------------------
        | Override OPEN
        |--------------------------------------------------------------------------
        */
        if ($business->manual_override === 'open' && $business->manual_override_until && $now->lt($business->manual_override_until)) {
            return [
                'status' => 'open',
                'reason' => 'manual',
                'opens_at' => $open,
                'closes_at' => $close,
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Override CLOSED
        |--------------------------------------------------------------------------
        */

        if ( $business->manual_override === 'closed' && $business->manual_override_until && $now->lt($business->manual_override_until) ) {
            return [
                'status' => 'closed',
                'reason' => 'manual',
                'opens_at' => $open,
                'closes_at' => $close,
            ];
        }

        /*
        |--------------------------------------------------------------------------
        | Horario normal
        |--------------------------------------------------------------------------
        */
        if ($now->between($open, $close)) {

            return [
                'status' => 'open',
                'reason' => 'schedule',
                'opens_at' => $open,
                'closes_at' => $close,
            ];
        }

        return [
            'status' => 'closed',
            'reason' => 'schedule',
            'opens_at' => $open,
            'closes_at' => $close,
        ];
    }
}
