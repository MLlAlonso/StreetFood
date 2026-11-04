<?php

namespace App\Console\Commands;

use App\Models\BusinessLiveLocation;
use Illuminate\Console\Command;

class StopBusinessLiveLocationsAtClosing extends Command
{
    protected $signature = 'businesses:stop-live-locations-at-closing';
    protected $description = 'Stop business live locations when their scheduled closing time is reached';

    public function handle(): int
    {
        $now = now();

        BusinessLiveLocation::query()
            ->with(['business.hours'])
            ->where('active', true)
            ->chunkById(100, function ($locations) use ($now) {

                foreach ($locations as $location) {
                    $business = $location->business;

                    if (!$business || !$business->schedule_enabled) {
                        continue;
                    }

                    $todayHours = $business->hours->firstWhere('day_of_week', $now->dayOfWeek);

                    if (!$todayHours || !$todayHours->enabled || !$todayHours->close_time) {
                        continue;
                    }

                    $closingTime = $now->copy()->setTimeFromTimeString($todayHours->close_time);

                    if ($now->greaterThanOrEqualTo($closingTime)) {
                        $location->update([
                            'active' => false,
                            'latitude' => null,
                            'longitude' => null,
                            'updated_at' => null,
                        ]);

                        $this->info( "Live location stopped for business {$business->id}." );
                    }
                }
            });

        return self::SUCCESS;
    }
}