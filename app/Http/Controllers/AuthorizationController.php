<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GraphQLServer;

class AuthorizationController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }


	/*
	 * @TODO: Construct a Socialite Factory Factory seeded by the $provider to handle specific configuraitons
	 * @TODO: Find a good place to register what providers are supported
	 * @TODO: Construct a type to handle persistance of a response
	 */
	public function authorizeProvider($provider) {
		if(!in_array($provider, config('services.providers'))){
			abort(404);
		}

		switch($provider){
			case "reddit":
				$scopes = ['identity', 'edit', 'flair', 'history', 'modconfig', 'modflair', 'modlog', 'modposts', 'modwiki', 'mysubreddits', 'privatemessages', 'read', 'report', 'save', 'submit', 'subscribe', 'vote', 'wikiedit', 'wikiread'];

				$additionalConfig = ['duration' => 'permanent'];
				return \Socialite::with($provider)->scopes($scopes)->with($additionalConfig)->redirect();
				break;

			case "twitter":
				return \Socialite::with('twitter')->redirect();
				break;


			case "youtube":
				return \Socialite::with('youtube')->with(['prompt' => 'consent', 'access_type' => 'offline'])->redirect();
				break;

			case "github":
				return \Socialite::with('github')->redirect();
				break;

			default:
				abort(404);
		}
	}

	public function createAuthorization(Request $request, $provider) {
		$server = GraphQLServer::where('slug', $provider)->firstOrFail();

		switch($provider){
			case "reddit":
				$user = \Socialite::with($provider)->user();

				$authorization = [
					'access_token' => $user->accessTokenResponseBody['access_token'],
					'refresh_token' => $user->accessTokenResponseBody['refresh_token'],
					'meta' => json_encode(['expires_in' => $user->accessTokenResponseBody['expires_in']]),
					'server_id' => $server->id
				];

				\Auth::user()->authorizations()->updateOrCreate(['server_id' => $server->id], $authorization);

				break;

				case "twitter":
					$user = \Socialite::with($provider)->user();
					$authorization = [
						'access_token'  => $user->accessTokenResponseBody['oauth_token'],
						'refresh_token' => $user->accessTokenResponseBody['oauth_token_secret'],
						'meta' => json_encode(['expires_in' => null]),
						'server_id' => $server->id
					];

				\Auth::user()->authorizations()->updateOrCreate(['server_id' => $server->id], $authorization);

					break;

				case "youtube":
					$user = \Socialite::with($provider)->user();
					$authorization = [
						'access_token'  => $user->accessTokenResponseBody['access_token'],
						'refresh_token' => $user->accessTokenResponseBody['refresh_token'],
						'meta' => json_encode(['expires_in' => $user->accessTokenResponseBody['expires_in']]),
						'server_id' => $server->id
					];

				\Auth::user()->authorizations()->updateOrCreate(['server_id' => $server->id], $authorization);

					break;

				case "github":
					$user = \Socialite::with($provider)->user();
					$authorization = [
						'access_token'  => $user->token,
						'refresh_token' => $user->refreshToken,
						'meta' => $user->expiresIn,
						'server_id' => $server->id
					];

				\Auth::user()->authorizations()->updateOrCreate(['server_id' => $server->id], $authorization);

					break;
			default:
				abort(404);
		}
		
		$request->session()->flash('status', "You have successfully authorized ${provider}");
		return redirect('home');
	}
}
