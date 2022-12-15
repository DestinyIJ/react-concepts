import React, { useState, useEffect, useRef } from 'react';
import SimplePeer, { SignalData } from 'simple-peer';
import io from 'socket.io-client';

const VideoChat = () => {
    const [peer, setPeer] = useState<any | null>(null);
    const localStream = useRef<HTMLVideoElement| null>(null)
    const remoteStream = useRef<HTMLVideoElement| null>(null)


    new MediaStream()

    // Connect to the Socket.io server
    const socket = io('http://localhost:3000');

    // Set up the Simple Peer connection
    const setupPeer = (initiator: boolean, stream: MediaStream) => {
        const p = new SimplePeer({
        initiator,
        stream,
        });

        p.on('signal', (data: SignalData) => {
        // Send the signal data to the server via Socket.io
        socket.emit('signal', JSON.stringify(data));
        });

        p.on('stream', (stream: MediaStream) => {
        // Set the remote video stream
        if(remoteStream.current !== null) {
            remoteStream.current.srcObject = stream
        };
        });

        setPeer(p);
    };

    // Set up the local video stream
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
            setupPeer(true, stream)
            if(localStream.current !== null) {
                localStream.current.srcObject = stream
            };
        });
    }, []);

    // Handle incoming messages from the server
    socket.on('signal', (data) => {
        // Signal the peer connection with the incoming data
        peer!.signal(JSON.parse(data));
    });

    return (
        <div>
        <video ref={localStream} autoPlay={true} />
        <video ref={remoteStream} autoPlay={true} />
        </div>
    );
};

export default VideoChat;
