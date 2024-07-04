<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Notifications\VerifyEmailNotification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];
    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {      
        // VerifyEmail::toMailUsing(function ($notifiable, $url) {
        //     $url = "http://localhost:8000/api";
        //     return (new VerifyEmailNotification($url))->toMail($notifiable);
        // });
    }
}
