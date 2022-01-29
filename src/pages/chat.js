import React, { useEffect, useState } from "react";
import appConfig from "../../config.json";

import { ButtonSendSticker } from "../components/ButtonSendSticker";

import { Box, Text, TextField, Image, Button } from "@skynexui/components";

import { useRouter } from "next/router";
import { supabaseClient } from "../services/supabase";

function listenMessageRealTime(insertMessage) {
    return supabaseClient
        .from("mensagens")
        .on("INSERT", (response) => {
            insertMessage(response.new);
        })
        .subscribe();
}

export default function ChatPage() {
    const router = useRouter();
    const userLoggedIn = router.query.username;
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    useEffect(() => {
        supabaseClient
            .from("mensagens")
            .select("*")
            .order("id", { ascending: false })
            .then(({ data }) => {
                setMessageList(data);
            });

        listenMessageRealTime((newMessage) => {
            setMessageList((actualValue) => {
                return [newMessage, ...actualValue];
            });
        });
    }, []);

    function handleMessage(newMessage) {
        const chatMessage = {
            de: userLoggedIn,
            texto: newMessage,
        };

        supabaseClient
            .from("mensagens")
            .insert([chatMessage])
            .then(({ data }) => {});
        setMessage("");
    }

    return ( <
        Box styleSheet = {
            {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://img.freepik.com/vetores-gratis/fundo-abstrato-da-particula-da-tecnologia_1199-277.jpg?size=626&ext=jpg)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                color: appConfig.theme.colors.neutrals["000"],
            }
        } >
        <
        Box styleSheet = {
            {
                display: "flex",
                flexDirection: "column",
                flex: 1,
                boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
                borderRadius: "5px",
                backgroundColor: appConfig.theme.colors.neutrals[700],
                height: "100%",
                maxWidth: "95%",
                maxHeight: "95vh",
                padding: "32px",
            }
        } >
        <
        Header / >
        <
        Box styleSheet = {
            {
                position: "relative",
                display: "flex",
                flex: 1,
                height: "80%",
                backgroundColor: appConfig.theme.colors.neutrals[600],
                flexDirection: "column",
                borderRadius: "5px",
                padding: "16px",
            }
        } >
        <
        MessageList messages = { messageList }
        /> <
        Box as = "form"
        styleSheet = {
            {
                display: "flex",
                alignItems: "center",
            }
        } >
        <
        TextField value = { message }
        onKeyPress = {
            (event) => {
                if (event.key === "Enter") {
                    handleMessage(message);
                }
            }
        }
        onChange = {
            (event) => setMessage(event.target.value) }
        placeholder = "Insira sua mensagem aqui..."
        type = "textarea"
        styleSheet = {
            {
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
            }
        }
        /> <
        ButtonSendSticker onStickerClick = {
            (sticker) => {
                handleMessage(`:sticker: ${sticker}`);
            }
        }
        /> <
        /Box> <
        /Box> <
        /Box> <
        /Box>
    );
}

function Header() {
    return ( <
        >
        <
        Box styleSheet = {
            {
                width: "100%",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }
        } >
        <
        Text variant = "heading5" > Chat < /Text> <
        Button variant = "tertiary"
        colorVariant = "neutral"
        label = "Logout"
        href = "/" /
        >
        <
        /Box> <
        />
    );
}

function MessageList({ messages }) {
    return ( <
        Box tag = "ul"
        styleSheet = {
            {
                overflow: "scroll",
                display: "flex",
                flexDirection: "column-reverse",
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: "16px",
            }
        } >
        {
            messages.map((message) => ( <
                Text key = { message.id }
                tag = "li"
                styleSheet = {
                    {
                        borderRadius: "5px",
                        padding: "6px",
                        marginBottom: "12px",
                        hover: {
                            backgroundColor: appConfig.theme.colors.neutrals[700],
                        },
                    }
                } >
                <
                Box styleSheet = {
                    {
                        marginBottom: "8px",
                    }
                } >
                <
                Image styleSheet = {
                    {
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        display: "inline-block",
                        marginRight: "8px",
                    }
                }
                src = { `https://github.com/${message.de}.png` }
                /> <
                Text tag = "strong" > { message.de } < /Text> <
                Text styleSheet = {
                    {
                        fontSize: "10px",
                        marginLeft: "8px",
                        color: appConfig.theme.colors.neutrals[300],
                    }
                }
                tag = "span" >
                { new Date().toLocaleDateString() } <
                /Text> <
                /Box> {
                    message.texto.startsWith(":sticker:") ? ( <
                        Image src = { message.texto.replace(":sticker:", "") }
                        />
                    ) : (
                        message.texto
                    )
                } <
                /Text>
            ))
        } <
        /Box>
    );
}