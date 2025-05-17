export interface WeatherData {
    name: string;
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        speed: number;
        deg: number;
    };
    visibility: number,
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    dt: number;
}

export interface ForecastData {
    list: {
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            humidity: number;
            pressure: number;
        };
        weather: {
            id: number;
            main: string;
            description: string;
            icon: string;
        }[];
        wind: {
            speed: number;
            deg: number;
        };
        dt_txt: string;
    }[];
    city: {
        name: string;
        country: string;
    };
}

export interface LocationData {
    name: string;
    country: string;
    lat: number;
    lon: number;
    state?: string;
}