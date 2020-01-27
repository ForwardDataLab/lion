<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => 'us-east-1',
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\Models\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],
	'providers' => [
		'reddit','twitter','youtube', 'github'
	],
	'reddit' => [
			'client_id' => env('REDDIT_KEY'),
			'client_secret' => env('REDDIT_SECRET'),
			'redirect' => env('REDDIT_REDIRECT_URI'),  
	], 
	'youtube' => [
			'client_id' => env('YOUTUBE_KEY'),
			'client_secret' => env('YOUTUBE_SECRET'),
			'redirect' => env('YOUTUBE_REDIRECT_URI'),  
	], 
	'twitter' => [
			'client_id' => env('TWITTER_KEY'),
			'client_secret' => env('TWITTER_SECRET'),
			'redirect' => env('TWITTER_REDIRECT_URI'),  
    ],
    'github' => [
            'client_id' => env('GITHUB_KEY'),
            'client_secret' => env('GITHUB_SECRET'),
            'redirect' => env('GITHUB_REDIRECT_URI')
    ],
];
