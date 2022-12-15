import React, { useState, useEffect, useRef } from 'react';
import SimplePeer, { SignalData } from 'simple-peer';
import io from 'socket.io-client';

const AudioChat = () => {
    const [peer, setPeer] = useState<any | null>(null);
    const localStream = useRef<HTMLAudioElement | null>(null)
    const remoteStream = useRef<HTMLAudioElement| null>(null)

    // Connect to the Socket.io server
    const socket = io('http://localhost:3000');

    // Set up the Simple Peer connection
    const setupPeer = (initiator: boolean, stream: MediaStream) => {
        const p = new SimplePeer({
        initiator,
        stream
        });

        p.on('signal', (data: SignalData) => {
        // Send the signal data to the server via Socket.io
        socket.emit('signal', JSON.stringify(data));
        });

        p.on('stream', (stream: MediaStream) => {
            // Set the remote audio stream
            if(remoteStream.current !== null) {
                remoteStream.current.srcObject = stream
            };
        });

        setPeer(p);
    };

    // Set up the local audio stream
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            // setLocalStream(stream);
            setupPeer(true, stream)
            if(localStream.current !== null) {
                localStream.current.srcObject = stream
            }
            
        });
    }, []);

    // Handle incoming messages from the server
    socket.on('signal', (data) => {
        // Signal the peer connection with the incoming data
        peer!.signal(JSON.parse(data));
    });

    return (
        <div>
        <audio ref={localStream} autoPlay={true} />
        <audio ref={remoteStream} autoPlay={true} />
        </div>
    );
};

export default AudioChat;
