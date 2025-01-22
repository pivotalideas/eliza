import {
    type Action,
    type ActionExample,
    composeContext,
    type IAgentRuntime,
    type Memory,
    type State,
    generateText,
    ModelClass,
    Content,
    HandlerCallback,
} from "@elizaos/core";
import {
    type Channel,
    ChannelType,
    type Client,
    type Message as DiscordMessage,
    type Guild,
    type GuildMember,
} from "discord.js";
import SpotifyWebApi from 'spotify-web-api-node';
import {
    AudioPlayer,
    AudioReceiveStream,
    AudioPlayerStatus,
    NoSubscriberBehavior,
    StreamType,
    VoiceConnection,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    getVoiceConnection,
    joinVoiceChannel,
    entersState,
} from "@discordjs/voice";

export default {
    name: "LISTEN_MUSIC",
    similes: [
        "LISTEN",
        "MUSIC",
        "PLAY_MUSIC",
        "MUSIC_PLAYING"
    ],
    validate: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        if (message.content.source !== "discord") {
            // not a discord message
            return false;
        }

        if (!state.discordClient) {
            return false;
        }

        // const keywords = [
        //     "leave",
        //     "exit",
        //     "stop",
        //     "quit",
        //     "get off",
        //     "get out",
        //     "bye",
        //     "cya",
        //     "see you",
        //     "hop off",
        //     "get off",
        //     "voice",
        //     "vc",
        //     "chat",
        //     "call",
        //     "meeting",
        //     "discussion",
        // ];
        // if (
        //     !keywords.some((keyword) =>
        //         message.content.text.toLowerCase().includes(keyword)
        //     )
        // ) {
        //     return false;
        // }
        return true;
    },
    description: "Play Music From Spotify",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback: HandlerCallback
    ): Promise<boolean> => {
        if (!state.discordClient) {
            return;
        }

        const callbackData: Content = {
            text: "", // fill in later
            action: "",
            source: message.content.source,
            attachments: [],
        };

        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        });


        const spotifyData = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(spotifyData.body['access_token']);

        const searchResults = await spotifyApi.searchTracks('Hyde');

        let ytQuery = '';
        if (searchResults.body.tracks.items.length > 0) {
            const track = searchResults.body.tracks.items[0];
            const trackUrl = track.external_urls.spotify;
            const trackName = track.name;
            const trackArtist = track.artists[0].name;

            ytQuery = `${trackName} ${trackArtist}`;
            // const results = await ytSearch.GetListByKeyword(ytQuery, false);
            callbackData.text = `Here is a good music ${ytQuery}`

            // const videoUrl = `https://www.youtube.com/watch?v=${results.items[0].id}`;
            // const option = {
            //     filter: "audioonly",
            //     highWaterMark: 1048576 / 4,
            // };
            // const stream = ytdl(videoUrl, option);
            // // const stream = await play.stream(videoUrl, {
            // //     discordPlayerCompatibility: true,
            // //     quality: 1, // Adjust quality if needed
            // // });
            // // let so_info = await play.soundcloud('https://soundcloud.com/jkylxhyde/movement?utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing') // Make sure that url is track url only. For playlist, make some logic.
            // // console.log(so_info.name)
            // // let stream = await play.stream_from_info(so_info)

            // // console.log(stream);
            // const resource = createAudioResource(stream);
            // // We normalize data in from voice channels
            // const discordMessage = (state.discordChannel ||
            // state.discordMessage) as DiscordMessage;

            // const id = (discordMessage as DiscordMessage).guild?.id as string;

            // const connection = getVoiceConnection(id);

            // const audioPlayer = createAudioPlayer({
            //     behaviors: {
            //         noSubscriber: NoSubscriberBehavior.Play
            //     },
            // });

            // console.log("connection", connection);

            // connection.subscribe(audioPlayer);


            // audioPlayer.play(resource);

            // console.log("play");
            // audioPlayer.on(AudioPlayerStatus.Playing, () => {
            //     console.log("Playing right now")
            // });


            // audioPlayer.on("error", (err: any) => {
            //     console.log(`Audio player error: ${err}`);
            // });

            // audioPlayer.on(
            //     "stateChange",
            //     (_oldState: any, newState: { status: string }) => {
            //         if (newState.status == "idle") {
            //             const idleTime = Date.now();
            //             console.log(
            //                 `Audio playback took: ${idleTime}ms`
            //             );
            //         }
            //     }
            // );
        }

        await callback(callbackData);

    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Hey {{user2}} I want to listen to some music",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure",
                    action: "LISTEN_MUSIC",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "I want to listen to hyde",
                },
            },
            {
                user: "{{user2}}",
                content: {
                    text: "Sure will join discord channel to listen to play music",
                    action: "LISTEN_MUSIC",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
