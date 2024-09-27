'use client'
import styles from "../styles/style.module.css";
import {useEffect, useState} from "react";

export default function Page() {

    const [tokenJarPop, setTokenJarPop] = useState(false)
    const [coinDrop, setCoinDrop] = useState(false)
    const [coinOpacity, setCoinOpacity] = useState(false)

    const popTokenJar = () => {
        setCoinDrop(true)
        setCoinOpacity(true)

        setTimeout(() => {
            setCoinOpacity(false)
            setTokenJarPop(true)

            setTimeout(() => {
                setCoinDrop(false)
            }, 500);

            setTimeout(() => {
                setTokenJarPop(false)
            }, 1000);
        }, 300);
    }

    return (
        <div>
            <div className={styles.scrollingBackgroundContainer}>
                <div className={styles.scrollingBackground}></div>
                <div className={styles.pageContainer}>
                    <div className={styles.container}>
                        <center>
                            <img className={styles.cartoonivalLogo} src="/assets/ttr/cartoonival_logo.png" />
                        </center>
                        <h1 className={styles.pageTitle}>Cavalcade Tracker</h1>
                        <CartoonivalTracker />

                        <br />
                        <br />
                        <h1 className={styles.pageTitle}>
                            Token Animation Test
                        </h1>
                        <div className={styles.tokenAnimationContainer} onClick={() => popTokenJar()}>
                            <div className={`${styles.token} ${coinDrop ? styles.drop : ''} ${coinOpacity ? styles.fade : ''}`}></div>
                            <div className={`${styles.tokenJar} ${tokenJarPop ? styles.pop : ''}`}></div>
                        </div>
                        <br />
                        <br />

                        <RiggyTokenTracker />

                        <div className={styles.discordBox}>
                            <h1>Track the Cartoonival on Discord</h1>
                            <p>Add our handy Cartoonibot to run /cavalcade anywhere in Discord!</p>
                            <a target="_blank" href="https://discord.com/oauth2/authorize?client_id=1286429505551994942" className={styles.discordButton}>Add Cartoonibot</a>
                        </div>

                        <div className={styles.footer}>
                            This website is not affiliated with <a href="https://toontownrewritten.com/">Toontown Rewritten</a>,<br />any assets used are owned by them.
                            <br /><br />
                            &copy;2024 TownTracker
                            <br /><br />
                            <a href="https://github.com/jakebooy2/cavalcade-tracker"><i className="fa-brands fa-github"></i> View on GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CartoonivalTracker = () => {
    const [status, setStatus] = useState("loading")

    const [checkBackTime, setCheckBackTime] = useState("")
    const [streetLocation, setStreetLocation] = useState(null)

    useEffect(() => {
        const callForCavalcade = async () => {
            const response = await fetch("https://toontownrewritten.com/api/cavalcade", {cache: "no-cache"})

            if(!response.ok)
                return null

            return await response.json()
        }

        // local variables are required as the state
        // cannot be accessed during a setInterval() request
        let apiStatus = ""
        let apiStreet = ""
        let lastApiCall: any = -1

        setInterval(() => {
            const date = new Date();
            const minute = date.getMinutes();

            if(minute < 25 || minute >= 40){
                // Cooldown Period
                setStatus("recharging")
                setStreetLocation(null)

                // Announce to 26 minutes past
                const announceDate = new Date()
                announceDate.setMinutes(26)
                announceDate.setSeconds(0)
                if(minute >= 40){
                    announceDate.setHours(announceDate.getHours() + 1)
                }
                setCheckBackTime(checkBackString(date, announceDate))
            }else if(minute >= 26 && minute < 30){
                // In Transit Period
                if(!(apiStatus === "in-transit" && apiStreet != "")){
                    // call ttr update for an update
                    // 5 second cache
                    if(lastApiCall == null || (Date.now() - lastApiCall) > (5*1000)) {
                        callForCavalcade().then((json) => {
                            if (json == "null" || json == null) {
                                setStatus("error")
                                apiStatus = "error"
                            } else {
                                if (json.paradeStatus === "in-transit") {
                                    apiStatus = "in-transit"
                                    apiStreet = json.paradeLocationString
                                    setStatus("in-transit")
                                    setStreetLocation(json.paradeLocationString)
                                }
                            }
                            lastApiCall = Date.now()
                        })
                    }
                }

                // Time for 30 minutes past
                const announceDate = new Date()
                announceDate.setMinutes(30)
                announceDate.setSeconds(0)
                if(minute >= 40){
                    announceDate.setHours(announceDate.getHours() + 1)
                }
                setCheckBackTime(checkBackString(date, announceDate))
            }else {
                // Cavalcade is active
                if (apiStatus !== "active" && apiStreet != "") {
                    apiStatus = "active"
                    setStatus("active")
                } else {
                    // call ttr update for an update
                    // 20 second cache
                    if (lastApiCall == null || (Date.now() - lastApiCall) > (20 * 1000)) {
                        callForCavalcade().then((json) => {
                            if (json == "null" || json == null) {
                                setStatus("error")
                                apiStatus = "error"
                            } else {
                                // check all values in case the api is slow to update,
                                // or the cavalcade is less than 10 minutes long
                                if(json.paradeStatus == "recharging" && apiStatus !== "recharging"){
                                    apiStatus = "recharging"
                                    apiStreet = ""
                                    setStatus("recharging")
                                    setStreetLocation(null)

                                    const announceDate = new Date()
                                    announceDate.setMinutes(26)
                                    announceDate.setSeconds(0)
                                    if(minute >= 40){
                                        announceDate.setHours(announceDate.getHours() + 1)
                                    }
                                    setCheckBackTime(checkBackString(date, announceDate))
                                }
                                if(json.paradeStatus == "in-transit" && apiStatus !== "in-transit"){
                                    apiStatus = "in-transit"
                                    apiStreet = json.paradeLocationString
                                    setStatus("in-transit")
                                    setStreetLocation(json.paradeLocationString)

                                    const announceDate = new Date()
                                    announceDate.setMinutes(30)
                                    announceDate.setSeconds(0)
                                    if(minute >= 40){
                                        announceDate.setHours(announceDate.getHours() + 1)
                                    }
                                    setCheckBackTime(checkBackString(date, announceDate))
                                }
                                if(json.paradeStatus == "active" && apiStatus !== "active"){
                                    apiStatus = "active"
                                    apiStreet = json.paradeLocationString
                                    setStatus("active")
                                    setStreetLocation(json.paradeLocationString)
                                }
                            }
                            lastApiCall = Date.now()
                        })
                    }
                }
            }
        }, 1000)
    }, []);

    if(status === "error"){
        return(
            <div className={styles.cartoonivalAnnouncer}>
                <div className={styles.imageContainer}>
                    <img src="/assets/ttr/cartoonival-icon.png" />
                </div>

                <div className={styles.locationString} style={{marginBottom: '15px'}}>
                    <span><i className="fa-solid fa-rotate fa-spin"></i> Received an error from the TTR api, retrying shortly.</span>
                </div>
            </div>
        )
    }

    if(status === "loading"){
        return(
            <div className={styles.cartoonivalAnnouncer}>
                <div className={styles.imageContainer}>
                    <img src="/assets/ttr/cartoonival-icon.png" />
                </div>

                <div className={styles.locationString} style={{marginBottom: '25px'}}>
                    <span style={{fontSize: '28px'}}>Waiting for the TTR API to update...</span>
                </div>
            </div>
        )
    }

    if(status === "recharging"){
        return(
            <div className={styles.cartoonivalAnnouncer}>
                <div className={styles.imageContainer}>
                    <img src="/assets/ttr/cartoonival-icon.png" />
                </div>

                <div className={styles.locationString}>
                    <span>The Cavalcade is recharging!</span>
                </div>
                {checkBackTime != "" && <div className={styles.timeString}>
                    <i className="fa-solid fa-rotate fa-spin"></i> Check back in {checkBackTime}
                </div>}
            </div>
        )
    }

    return(
        <div className={styles.cartoonivalAnnouncer}>
            <div className={styles.imageContainer}>
                <img src={streetLocation == null ? "/assets/ttr/cartoonival-icon.png" : parseStreetLocation(streetLocation).image} />
                <div className={styles.locationName}>
                    {streetLocation == null ? "/assets/ttr/cartoonival-icon.png" : parseStreetLocation(streetLocation).playground}
                </div>
            </div>

            <div className={styles.locationString} style={status == "active" ? {marginBottom: '15px'} : {marginBottom: '5px'}}>
                {status == "active" ? <div>
                    <p>The Cavalcade is currently at</p>
                    {streetLocation && streetLocation}
                </div> : <div>
                    <p>The Cavalcade is on it's way to</p>
                    {streetLocation && streetLocation}
                </div> }
            </div>

            {(status == "in-transit" && checkBackTime != "") && <div className={styles.timeString}>
                <i className="fa-solid fa-clock"></i> The parade starts in {checkBackTime}!
            </div>}
        </div>
    )
}

const RiggyTokenTracker = () => {

    const [tokens, setTokens] = useState(-1)

    useEffect(() => {
        const callForTokens = async () => {
            const response = await fetch("https://toontownrewritten.com/api/riggydonations", {cache: "no-cache"})

            if(!response.ok)
                return null

            return await response.json()
        }

        let lastApiCall: any = null

        setInterval(() => {
            // Call for the token count
            // 30 second cache
            if (lastApiCall == null || (Date.now() - lastApiCall) > (30 * 1000)) {
                callForTokens().then((json) => {
                    setTokens(json.tokensDonated)
                    lastApiCall = Date.now()
                })
            }
        }, 1000)
    }, []);

    return(
        <div className={styles.tokenTracker}>
            <div className={styles.tokenTrackerImage}>
                <img src="/assets/ttr/riggy.png" width="250" height="340" />
            </div>
            <div className={styles.tokenTrackerContent}>
                <div>
                    <h1>{tokens == -1 ? 'Loading...' : numberWithCommas(tokens)}</h1>
                    <p>{tokens != -1 && 'tokens have been donated to Riggy Marole!'}</p>
                </div>
            </div>
        </div>
    )
}

const parseStreetLocation = (street?: string) => {
    switch(street){
        case "Punchline Place":
        case "Loopy Lane":
        case "Silly Street":
            return {
                street: street,
                playground: "Toontown Central",
                image: "/assets/ttr/playground/Toontown_Central.png"
            }
        case "Barnacle Boulevard":
        case "Seaweed Street":
        case "Lighthouse Lane":
            return {
                street: street,
                playground: "Donald's Dock",
                image: "/assets/ttr/playground/Donalds_Dock.png"
            }
        case "Elm Street":
        case "Maple Street":
        case "Oak Street":
            return {
                street: street,
                playground: "Daisy Gardens",
                image: "/assets/ttr/playground/Daisy_Gardens.png"
            }
        case "Alto Avenue":
        case "Baritone Boulevard":
        case "Tenor Terrace":
            return {
                street: street,
                playground: "Minnie's Melodyland",
                image: "/assets/ttr/playground/Minnies_Melodyland.png"
            }
        case "Sleet Street":
        case "Walrus Way":
        case "Polar Place":
            return {
                street: street,
                playground: "The Brrrgh",
                image: "/assets/ttr/playground/The_Brrrgh.png"
            }
        case "Lullaby Lane":
        case "Pajama Place":
            return {
                street: street,
                playground: "Donald's Dreamland",
                image: "/assets/ttr/playground/Donalds_Dreamland.png"
            }
        default:
            return {
                street: street,
                playground: "Unknown Playground",
                image: "/assets/ttr/cartoonival-carousel.webp"
            }
    }
}

const checkBackString = (beforeDate: any, afterDate: any) => {
    if(afterDate - beforeDate <= 0)
        return ""

    const dateDifference = getDifferenceInTime(beforeDate, afterDate)

    let minuteString
    if(dateDifference.minutes == 0){
        minuteString = ""
    }else{
        minuteString = `${dateDifference.minutes} minute${dateDifference.minutes == 1 ? '' : 's'}${dateDifference.seconds > 0 ? ' and ' : ''}`
    }

    let secondString
    if(dateDifference.seconds < 1){
        secondString = ""
    }else{
        if(dateDifference.seconds == 0)
            dateDifference.seconds = 60
        secondString = `${dateDifference.seconds} second${dateDifference.seconds == 1 ? '' : 's'}`
    }

    return `${minuteString} ${secondString}`
}

const getDifferenceInTime = (beforeDate: any, afterDate: any) => {
    let delta = Math.abs(afterDate - beforeDate) / 1000;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = parseInt(String(delta));

    return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds
    }
}

const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}