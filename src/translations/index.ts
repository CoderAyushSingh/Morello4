
export const translations = {
    en: {
        nav: {
            home: "Home",
            movies: "Movies",
            series: "Series",
            genres: "Genres",
            reviews: "Reviews",
            topRated: "Top Rated",
            drama: "DRAMA",
            upcoming: "UPCOMING",
            login: "Login",
            logout: "Logout",
            myProfile: "My Profile",
            myReviews: "My Reviews",
            myCollections: "My Collections",
            savedCollections: "Saved Collections",
            settings: "Settings"
        },
        hero: {
            titleLine1: "Everything Available",
            titleLine2: "on",
            subtitle: "Discover Movies & Series from India & the World",
            explore: "Explore Cinema",
            browse: "Browse Series",
            scroll: "Scroll"
        },
        home: {
            latestCinema: "Latest Cinema",
            viewAll: "View All Movies",
            globalCharts: "Global Charts",
            topMoviesTitle: "Top 10 Movies of 2025",
            editorsChoice: "Editor's Choice",
            picksTitle: "Morello Picks — Best of Global Media",
            picksDesc: "A hand-curated selection of premium cinema and digital series representing the pinnacle of visual storytelling.",
            streamingTrends: "Streaming Trends",
            topSeriesTitle: "Top 10 Web Series of 2025",
            browseCinema: "Cinema",
            browseCinemaDesc: "Experience 100 Years of Film",
            browseSeries: "Series",
            browseSeriesDesc: "Binge-worthy Original Stories"
        },
        footer: {
            tagline: "Cinema & Digital Series",
            description: "Curating the world's finest visual storytelling. Experience premium entertainment discovery without boundaries.",
            discover: "Discover",
            newReleases: "New Releases",
            topCharts: "Top Charts",
            editorsPicks: "Editor's Picks",
            hiddenGems: "Hidden Gems",
            company: "Company",
            about: "About Morello",
            press: "Press & Media",
            privacy: "Privacy Policy",
            contact: "Contact Us",
            newsletter: "Newsletter",
            newsletterDesc: "Join our elite circle of cinephiles.",
            emailPlaceholder: "EMAIL ADDRESS",
            rights: "© 2026 Morello Inc. All rights reserved.",
            love: "Love From Morello"
        }
    },
    hi: {
        nav: {
            home: "होम",
            movies: "फिल्में",
            series: "सीरीज",
            genres: "शैलियां",
            reviews: "समीक्षाएं",
            topRated: "टॉप रेटेड",
            drama: "ड्रामा",
            upcoming: "आने वाला",
            login: "लॉग इन",
            logout: "लॉग आउट",
            myProfile: "मेरी प्रोफाइल",
            myReviews: "मेरी समीक्षाएं",
            myCollections: "मेरे संग्रह",
            savedCollections: "सहेजे गए संग्रह",
            settings: "सेटिंग्स"
        },
        hero: {
            titleLine1: "सब कुछ उपलब्ध है",
            titleLine2: "पर",
            subtitle: "भारत और दुनिया भर से फिल्में और सीरीज खोजें",
            explore: "सिनेमा देखें",
            browse: "सीरीज देखें",
            scroll: "स्क्रॉल करें"
        },
        home: {
            latestCinema: "नवीनतम सिनेमा",
            viewAll: "सभी फिल्में देखें",
            globalCharts: "ग्लोबल चार्ट",
            topMoviesTitle: "2025 की शीर्ष 10 फिल्में",
            editorsChoice: "संपादक की पसंद",
            picksTitle: "मोरेलो पिक्स — सर्वश्रेष्ठ ग्लोबल मीडिया",
            picksDesc: "प्रीमियम सिनेमा और डिजिटल सीरीज का एक चुनिंदा संग्रह जो दृश्य कहानी कहने के शिखर का प्रतिनिधित्व करता है।",
            streamingTrends: "स्ट्रीमिंग ट्रेंड्स",
            topSeriesTitle: "2025 की शीर्ष 10 वेब सीरीज",
            browseCinema: "सिनेमा",
            browseCinemaDesc: "फिल्मों के 100 वर्षों का अनुभव करें",
            browseSeries: "सीरीज",
            browseSeriesDesc: "बिंज-योग्य मूल कहानियां"
        },
        footer: {
            tagline: "सिनेमा और डिजिटल सीरीज",
            description: "दुनिया की सबसे बेहतरीन दृश्य कहानियों को क्यूरेट करना। बिना सीमाओं के प्रीमियम मनोरंजन खोज का अनुभव करें।",
            discover: "खोजें",
            newReleases: "नई रिलीज",
            topCharts: "शीर्ष चार्ट",
            editorsPicks: "संपादक की पसंद",
            hiddenGems: "छिपे हुए रत्न",
            company: "कंपनी",
            about: "मोरेलो के बारे में",
            press: "प्रेस और मीडिया",
            privacy: "गोपनीयता नीति",
            contact: "संपर्क करें",
            newsletter: "न्यूज़लेटर",
            newsletterDesc: "सिनेफाइल्स के हमारे कुलीन सर्कल में शामिल हों।",
            emailPlaceholder: "ईमेल पता",
            rights: "© 2026 मोरेलो इंक. सर्वाधिकार सुरक्षित।",
            love: "मोरेलो की तरफ से प्यार"
        }
    }
};

export type Language = 'en' | 'hi';
export type TranslationKeys = keyof typeof translations.en;
