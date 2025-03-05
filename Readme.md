/*
compiles an android or ios app
npx expo run:ios
npx expo run:android

// if dosent work
npx expo run:android -D Medium_Phone_API

.\gradlew.bat assembleDebug --stacktrace
*/

// Spotify OAuth Configuration
const discovery = {
    // this is where to go to login
    authorizationEndpoint: "https://accounts.spotify.com/authorize",

    // this is where spotify sends your token after logining in
    tokenEndpoint: "https://accounts.spotify.com/api/token",
};


// this is when the app opens the browser, then after done logging in dy, it dosent close the browser
// so this closes the browser 
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () =>
{

    // redirect uri com.anonymous.MusicApp://spotify-auth-callback is for stand alone application not EXPO GO
    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "com.anonymous.MusicApp", // Ensure this matches your package name
        // path: "spotify-auth-callback",    // Optional path for handling redirects
    });


    console.log("Redirect URI:", redirectUri); // Debugging

    // to control the navigation after successful login 
    const navigation = useNavigation();

    const config = 
    {
        issuer: "https://accounts.spotify.com",

        // to get client id go to spotify dashboard, settings, 
        // who is the receipient 
        clientId: "3220583b77fa4059b20f9d0debd040e3",

        // what can be accessed 
        scopes: 
        [
            "user-read-email",
            "user-library-read",
            "user-read-recently-played",
            "user-top-read",
            "playlist-read-private",
            "playlist-read-collaborative",
            "playlist-modify-public" // or "playlist-modify-private"
        ],

        // get this from the spotify dashboard/ settings/ scroll down 
        // this is about where spotify will send you after giving you the key
        // redirectUri: AuthSession.makeRedirectUri
        // (
        //     {
        //     // native: "exp://10.192.4.119:8081/--/spotify-auth-callback"
        //     // native: "exp://localhost:19000/--/spotify-auth-callback"
        //     native: "exp://192.168.68.103:8081/--/spotify-auth-callback"
        //     }
        // ),
        redirectUri: "exp://127.0.0.1:19000",
    }

    // old uses depreceated library 
    // const result = await AppAuth.authAsync(config);
    // console.log(result);


    // request is our above config
    // response is the response from the request
    // promptAsync is the function to call when you want to run this function, also is the reason why the browser will open up 
    const [request, response, promptAsync] = AuthSession.useAuthRequest(config, discovery);

    useEffect(() => 
    {
        const checkTokenValidity = async () => 
        {

            // this is to constantly check the storage to get a valid token
            const accessToken = await AsyncStorage.getItem("token");
            const expirationDate = await AsyncStorage.getItem("expirationDate");

            console.log("Access Token:", accessToken);
            console.log("Expiration Date:", expirationDate);

            // check if they exist
            if (accessToken && expirationDate) 
                {
                // ge tthe current date and time
                const currentTime = Date.now();

                if (currentTime < parseInt(expirationDate)) {
                    // Token is still valid
                    navigation.replace("Main");
                } else {
                    // Token expired, remove it from storage
                    AsyncStorage.removeItem("token");
                    AsyncStorage.removeItem("expirationDate");
                }
            }
        };
    
        checkTokenValidity();
    }, []);

    // checks if we got a response 
    useEffect(() => 
    {
        console.log("OAuth Response:", response); // Debugging
        
        // response? the ? checks if the object is null or not first, its a safety check
        // example of response
        // {
        //     access_token: "abcd1234",
        //     expires_in: 3600
        // }
        if (response?.type === "success") {
            const { access_token, expires_in } = response.params;

            // Date.now() gives the current time in miliseconds
            const expirationDate = Date.now() + expires_in * 1000;

            AsyncStorage.setItem("token", access_token);

            // the idea is to put the time that the token will expire 
            AsyncStorage.setItem("expirationDate", expirationDate.toString());
            navigation.navigate("Main");
        }
    }, [response]);
    // the [response] is to only activate this useEffect() when response changes 

    const checkStorage = async () => 
    {
        const token = await AsyncStorage.getItem("token");
        console.log("Stored Token:", token);
    };


    useEffect(() => {
    checkStorage();
    }, []);

    const [loading, setLoading] = useState(false);
    
    const handleLogin = async () => 
    {
        console.log("handle login invoked" + loading + request);

        if ( !loading && request )
        {
            setLoading(true);
            const resultFromRequest = await promptAsync();
            console.log("Login Result:", resultFromRequest);
            setLoading(false);
        }

    };