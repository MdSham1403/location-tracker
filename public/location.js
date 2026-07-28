// location.js

const API_URL = "https://location-tracker-01sm.onrender.com";


function getCurrentLocation() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by this browser.");
        return;
    }


    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);


            const locationData = {
                name: "My Current Location",
                category: "Personal",
                lat: latitude,
                lng: longitude,
                dateVisited: new Date().toISOString(),
                notes: "Saved from mobile GPS"
            };


            try {

                const response = await fetch(
                    `${API_URL}/api/locations`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(locationData)
                    }
                );


                if (!response.ok) {
                    throw new Error("Failed to save location");
                }


                const result = await response.json();

                console.log("Saved:", result);

                alert(
                    `Location Saved!\n\nLat: ${latitude}\nLng: ${longitude}`
                );


            } catch(error) {

                console.error(error);
                alert("Location detected but saving failed.");

            }

        },


        (error)=>{

            switch(error.code){

                case error.PERMISSION_DENIED:
                    alert(
                    "Location permission denied. Please allow location access."
                    );
                    break;


                case error.POSITION_UNAVAILABLE:
                    alert(
                    "Unable to get location. Turn on GPS."
                    );
                    break;


                case error.TIMEOUT:
                    alert(
                    "Location request timed out."
                    );
                    break;


                default:
                    alert(
                    "Unknown location error."
                    );

            }

            console.error(error);

        },


        {
            enableHighAccuracy:true,
            timeout:10000,
            maximumAge:0
        }

    );

}



// Load saved locations

async function getSavedLocations(){

    try{

        const response = await fetch(
            `${API_URL}/api/locations`
        );


        const locations = await response.json();


        console.log(locations);

        return locations;


    }
    catch(error){

        console.error(
            "Loading locations failed:",
            error
        );

        return [];

    }

}