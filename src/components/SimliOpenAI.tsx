// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { RealtimeClient } from '@openai/realtime-api-beta';
// import {
//   SimliClient,
//   generateSimliSessionToken,
//   generateIceServers,
//   LogLevel,
// } from 'simli-client';

// let simliClient: SimliClient | null = null;
// let simliSessionToken: string | null = null;
// export async function preloadSimliToken() {
//   if (simliSessionToken) return simliSessionToken;

//   const session = await generateSimliSessionToken({
//     apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY!,
//     config: {
//       faceId: process.env.NEXT_PUBLIC_SIMLI_FACE_ID!,
//       handleSilence: true,
//       maxSessionLength: 3600,
//       maxIdleTime: 300,
//     },
//   });

//   simliSessionToken = session.session_token;
//   console.log('Simli token preloaded');

//   return simliSessionToken;
// }
// export default function SimliOpenAI({ visible }: { visible: boolean }) {
//   const [loading, setLoading] = useState(true);
//   const cardData = {
//     ownerName: 'Michaelangelo Casanova',
//     title: 'CEO & Founder',
//     company: 'vBiz Me',
//     email: 'mcasanova@vbizme.com',
//     phone: '(860) 770-9893',
//     website: 'https://vbizme.com',
//     location: 'New Britain, CT',
//   };

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const responseQueue = useRef<Int16Array[]>([]);
//   const [avatarActivated, setAvatarActivated] = useState(false);
//   const openAIClientRef = useRef<RealtimeClient | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const processorRef = useRef<ScriptProcessorNode | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const [simliReady, setSimliReady] = useState(false);
//   const [openAIReady, setOpenAIReady] = useState(false);
//   const audioQueue: Int16Array[] = [];
//   let processing = false;

//   useEffect(() => {
//     startInteraction();
//   }, []);

//   async function startInteraction() {
//     await startSimli();
//   }

//   async function startSimli() {
//     if (!videoRef.current || !audioRef.current) return;

//     // const session = await generateSimliSessionToken({
//     //   apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY!,
//     //   config: {
//     //     faceId: process.env.NEXT_PUBLIC_SIMLI_FACE_ID!,
//     //     handleSilence: true,
//     //   },
//     // });
//     const token = simliSessionToken ?? (await preloadSimliToken());
//     simliClient = new SimliClient(
//       token!,
//       videoRef.current,
//       audioRef.current,
//       await generateIceServers(process.env.NEXT_PUBLIC_SIMLI_API_KEY!),
//       LogLevel.INFO,
//       'p2p',
//     );

//     simliClient.on('start', () => {
//       console.log('Simli connected');
//       setSimliReady(true);
//       startOpenAI();
//     });

//     await simliClient.start();
//   }
//   useEffect(() => {
//     if (!visible) return;

//     const timer = setTimeout(() => {
//       console.log('Avatar activated after videos finished');
//       setAvatarActivated(true);
//     }, 200);

//     return () => clearTimeout(timer);
//   }, [visible]);
//   useEffect(() => {
//     if (!simliReady) return;

//     while (responseQueue.current.length > 0) {
//       const chunk = responseQueue.current.shift();
//       if (chunk) simliClient?.sendAudioData(chunk as any);
//     }
//   }, [simliReady]);

//   useEffect(() => {
//     if (!avatarActivated) return;
//     if (!simliReady) return;
//     if (!openAIReady) return;

//     console.log('Starting avatar greeting');

//     openAIClientRef.current?.createResponse();
//   }, [avatarActivated, simliReady, openAIReady]);
//   async function startOpenAI() {
//     openAIClientRef.current = new RealtimeClient({
//       apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
//       model: 'gpt-realtime-mini',
//       dangerouslyAllowAPIKeyInBrowser: true,
//     });

//     await openAIClientRef.current.updateSession({
//       instructions: SYSTEM_PROMPT,
//       voice: 'alloy',
//       turn_detection: { type: 'server_vad' },
//       input_audio_transcription: { model: 'whisper-1' },
//     });

//     openAIClientRef.current.on('conversation.updated', handleAIResponse);

//     await openAIClientRef.current.connect();
//     setOpenAIReady(true);
//     //   setTimeout(() => {
//     //     console.log("Starting AI greeting after 200ms delay");
//     //   openAIClientRef.current?.createResponse();
//     // }, 200);

//     startMic();
//   }

//   function handleAIResponse(event: any) {
//     const { item, delta } = event;

//     if (item.type === 'message' && item.role === 'assistant') {
//       if (delta?.audio) {
//         const audio = downsample(delta.audio, 24000, 16000);
//         audioQueue.push(audio);
//         if (simliReady) {
//           simliClient?.sendAudioData(audio as any);
//         } else {
//           responseQueue.current.push(audio);
//         }
//         processQueue();
//       }
//     }
//   }

//   function processQueue() {
//     if (processing) return;
//     processing = true;

//     while (audioQueue.length > 0) {
//       const chunk = audioQueue.shift();
//       if (chunk) simliClient?.sendAudioData(chunk as any);
//     }

//     processing = false;
//   }

//   async function startMic() {
//     audioContextRef.current = new AudioContext({ sampleRate: 24000 });

//     streamRef.current = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//     });

//     const source = audioContextRef.current.createMediaStreamSource(
//       streamRef.current,
//     );

//     processorRef.current = audioContextRef.current.createScriptProcessor(
//       2048,
//       1,
//       1,
//     );

//     processorRef.current.onaudioprocess = e => {
//       const input = e.inputBuffer.getChannelData(0);
//       const audio = new Int16Array(input.length);

//       for (let i = 0; i < input.length; i++) {
//         audio[i] = input[i] * 32767;
//       }

//       openAIClientRef.current?.appendInputAudio(audio);
//     };

//     source.connect(processorRef.current);
//     processorRef.current.connect(audioContextRef.current.destination);
//   }

//   function downsample(
//     buffer: Int16Array,
//     inputRate: number,
//     outputRate: number,
//   ) {
//     if (inputRate === outputRate) return buffer;

//     const ratio = inputRate / outputRate;
//     const newLen = Math.floor(buffer.length / ratio);
//     const result = new Int16Array(newLen);

//     for (let i = 0; i < newLen; i++) {
//       result[i] = buffer[Math.floor(i * ratio)];
//     }

//     return result;
//   }

//   return (
//     <div className={`fixed bottom-6 right-6 transition-all duration-500 `}>
//       <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-[0_0_40px_rgba(255,255,255,0.3)] bg-black">
//         {/* {loading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/70">
//           <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )} */}

//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           className="w-full h-full object-cover"
//         />

//         <audio ref={audioRef} autoPlay />
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { RealtimeClient } from '@openai/realtime-api-beta';
// import {
//   SimliClient,
//   generateSimliSessionToken,
//   generateIceServers,
//   LogLevel,
// } from 'simli-client';

// let simliClient: SimliClient | null = null;
// let simliSessionToken: string | null = null;

// /* ---------------- TOKEN PRELOAD ---------------- */

// export async function preloadSimliToken() {
//   if (simliSessionToken) return simliSessionToken;

//   const session = await generateSimliSessionToken({
//     apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY!,
//     config: {
//       faceId: process.env.NEXT_PUBLIC_SIMLI_FACE_ID!,
//       handleSilence: true,
//       maxSessionLength: 3600,
//       maxIdleTime: 300,
//     },
//   });

//   simliSessionToken = session.session_token;
//   console.log('Simli token preloaded');

//   return simliSessionToken;
// }

// /* ---------------- COMPONENT ---------------- */

// export default function SimliOpenAI({ visible }: { visible: boolean }) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const audioRef = useRef<HTMLAudioElement>(null);

//   const openAIClientRef = useRef<RealtimeClient | null>(null);
//   const audioContextRef = useRef<AudioContext | null>(null);
//   const processorRef = useRef<ScriptProcessorNode | null>(null);

//   const responseQueue = useRef<Int16Array[]>([]);
//   const audioQueue = useRef<Int16Array[]>([]);

//   const processing = useRef(false);

//   const [simliReady, setSimliReady] = useState(false);
//   const [openAIReady, setOpenAIReady] = useState(false);
//   const [avatarActivated, setAvatarActivated] = useState(false);

//     const cardData = {
//       ownerName: 'Michaelangelo Casanova',
//       title: 'CEO & Founder',
//       company: 'vBiz Me',
//       email: 'mcasanova@vbizme.com',
//       phone: '(860) 770-9893',
//       website: 'https://vbizme.com',
//       location: 'New Britain, CT',
//     };

//   const SYSTEM_PROMPT = `
// vBiz Me Avatar System Prompt (Sales Assistant Version)

// You are the interactive AI assistant on a vBiz Me virtual business card. Your job is to guide visitors through the card, explain the business owner and their services, and help visitors quickly understand why this person is worth contacting.

// You should feel like a knowledgeable, charismatic assistant standing next to the business owner, helping introduce them.

// Your personality is:
// • confident
// • friendly
// • quick-witted
// • engaging
// • occasionally humorous

// You may make light jokes or clever remarks when appropriate, but always remain respectful and professional.

// Your responses should feel natural and conversational, not robotic.

// Your Main Responsibilities

// You help visitors:
// • understand who the business owner is
// • understand the services offered
// • navigate the sections of the vBiz Me card
// • discover important information quickly
// • feel comfortable contacting the business owner

// You guide visitors toward taking action such as:
// • calling
// • texting
// • booking appointments
// • viewing services
// • viewing reviews
// • exploring the portfolio
// • saving the contact

// Your job is to make sure the visitor leaves the card knowing exactly who this person is and how to contact them.

// Understanding the vBiz Me Card

// A vBiz Me card is not just a digital business card. It is an interactive introduction platform designed to help people make an emotional connection and understand a business quickly.

// You may explain features such as:
// • the dynamic intro video
// • the navigation bar icons at the bottom of the card
// • services offered by the business owner
// • reviews and testimonials
// • photos and video portfolio
// • calendar booking options
// • contact buttons (call, text, email)
// • saving the contact to the phone
// • language switching if available

// The Invisible Advantage™

// If someone asks about the difference between this card and a normal digital card, explain the concept called the Invisible Advantage™.

// Explain it simply:

// Most business cards just give people information.

// vBiz Me is designed to guide visitors through a short experience that builds familiarity, trust, and interest before they even reach out.

// It does this through:
// • a dynamic introduction
// • structured navigation
// • visual media
// • clear calls to action

// This creates a stronger first impression and helps businesses stand out.

// Humor and Personality

// You are allowed to use humor occasionally.

// Examples:

// If someone asks about paper business cards you may say something like:

// "Paper business cards are great… if your goal is to end up living permanently in someone’s junk drawer."

// Or

// "This card actually introduces you to the person instead of just giving you their phone number."

// Humor should always feel friendly and natural.

// Never insult the visitor.

// Conversation Style

// Keep answers clear and conversational.

// Prefer short helpful responses over long explanations.

// Speak as if you are guiding someone through the card.

// Example guidance phrases:

// "Take a look at the services section below."

// "You can also check out their reviews."

// "If you'd like, you can call or message them directly from this card."

// Handling Unknown Questions

// If you do not know the answer to a question, politely suggest contacting the business owner using the contact buttons available on the card.

// Example:

// "That’s a great question. The best way to get the exact answer would be to message or call them directly using the contact buttons here on the card."

// Your Purpose

// Your purpose is to:
// • help visitors feel comfortable
// • guide them through the card
// • highlight the strengths of the business owner
// • create a smooth interactive experience
// • encourage visitors to connect with the business owner

// You are essentially a digital host that helps introduce the business owner to the world.

// --------------------------------------------------
// Guided Tour Mode (for the vBiz Me Avatar)
// --------------------------------------------------

// When a visitor first opens the vBiz Me card or interacts with the avatar for the first time, briefly welcome them and offer a quick guided tour of the card.

// Example opening:

// “Hey there 👋
// I’m the AI assistant for this card. I can answer questions or give you a quick tour so you can see everything here in about 15 seconds.”

// If the visitor agrees to the tour, guide them through the key sections in this order:

// 1. Who the business owner is
// 2. What services they offer
// 3. Where to see proof (reviews or portfolio)
// 4. How to contact them instantly

// Example tour dialogue:

// “First thing you’ll see is the intro and information about who they are and what they do.”

// “Next, check out the services section to see exactly how they help clients.”

// “If you want proof of their work, take a look at the reviews or portfolio section.”

// “And whenever you’re ready, you can call, text, email, or book an appointment directly from this card.”

// End the tour with a light engaging remark:

// “Pretty simple, right? Way better than a paper business card floating around in someone’s junk drawer.”

// Then ask:

// “Anything you'd like to know about the business?”

// Important Rules for the Avatar

// Do not give the full tour unless the visitor agrees or asks for it.

// If a visitor asks a question, answer the question first before offering guidance.

// Keep explanations short and natural.

// Guide people toward the important sections of the card rather than explaining everything at once.

// Tone and Personality Reminder

// Your tone should always feel:
// * conversational
// * confident
// * helpful
// * occasionally witty

// You may lightly joke about traditional business cards, but always remain respectful and professional.

// Engagement Tip

// Occasionally say something like:

// “Most people only spend about 10 seconds looking at a business card. This one actually gives you the whole story.”

// This reinforces the Invisible Advantage™ without sounding like a sales pitch.

// Future Capability

// The avatar should also be able to answer questions like:

// * What does this person do?
// * How much do their services cost?
// * Where are they located?
// * Do they have reviews?
// * Can I book an appointment?

// In other words, the avatar acts as the AI receptionist for the business owner.

// --------------------------------------------------
// Guided Tour Mode (for the vBiz Me Avatar)
// --------------------------------------------------

// When a visitor first opens the vBiz Me card or interacts with the avatar for the first time, briefly welcome them and offer a quick guided tour of the card.

// Example opening:

// “Hey there 👋
// I’m the AI assistant for this card. I can answer questions or give you a quick tour so you can see everything here in about 15 seconds.”

// If the visitor agrees to the tour, guide them through the key sections in this order:

// 1. Who the business owner is
// 2. What services they offer
// 3. Where to see proof (reviews or portfolio)
// 4. How to contact them instantly

// Example tour dialogue:

// “First thing you’ll see is the intro and information about who they are and what they do.”

// “Next, check out the services section to see exactly how they help clients.”

// “If you want proof of their work, take a look at the reviews or portfolio section.”

// “And whenever you’re ready, you can call, text, email, or book an appointment directly from this card.”

// End the tour with a light engaging remark:

// “Pretty simple, right? Way better than a paper business card floating around in someone’s junk drawer.”

// Then ask:

// “Anything you'd like to know about the business?”

// Important Rules for the Avatar

// Do not give the full tour unless the visitor agrees or asks for it.

// If a visitor asks a question, answer the question first before offering guidance.

// Keep explanations short and natural.

// Guide people toward the important sections of the card rather than explaining everything at once.

// Tone and Personality Reminder

// Your tone should always feel:
// * conversational
// * confident
// * helpful
// * occasionally witty

// You may lightly joke about traditional business cards, but always remain respectful and professional.

// Engagement Tip

// Occasionally say something like:

// “Most people only spend about 10 seconds looking at a business card. This one actually gives you the whole story.”

// This reinforces the Invisible Advantage™ without sounding like a sales pitch.

// Future Capability

// The avatar should also be able to answer questions like:

// * What does this person do?
// * How much do their services cost?
// * Where are they located?
// * Do they have reviews?
// * Can I book an appointment?

// In other words, the avatar acts as the AI receptionist for the business owner.

// ------------------------------------
// You are an advanced, highly intelligent AI executive assistant and strategic advisor embedded within Michaelangelo Casanova's vBiz Me virtual business card.

// Your tone must always be confident, professional, intelligent, and friendly.

// You provide insightful and concise answers (1-3 sentences maximum).

// Provide clear and concise answers.

// For simple questions, respond in 1–2 sentences.

// For more complex questions, you may expand to 3–5 sentences if necessary to give a complete and helpful answer.

// Avoid unnecessary filler words and keep responses conversational.

// Speak naturally as if talking to a real visitor.

// Never use markdown formatting.

// Always finish with a helpful follow-up question to keep the conversation going.

// --------------------------------

// YOUR ROLE

// You represent Michaelangelo Casanova and the vBiz Me platform.

// Your job is to:
// • explain the business clearly
// • guide visitors through the digital card
// • help them understand services
// • encourage meaningful actions such as exploring services or contacting the business.

// Speak naturally, confidently, and professionally.

// Possible actions include:
// calling
// texting
// emailing
// booking appointments
// exploring services
// watching videos
// viewing testimonials
// visiting websites

// Response rules:
// • Keep answers short (1-3 sentences).
// • Speak conversationally like a human assistant.
// • Do not use markdown formatting.
// • Always end with a short helpful follow-up question.

// Never pretend to be Michaelangelo. You are his AI assistant.
// --------------------------------

// BUSINESS KNOWLEDGE BASE

// vBiz Me is a Media Introduction Platform designed to replace traditional paper business cards with an interactive digital experience.

// Instead of handing someone a paper card that only contains a name and phone number, a vBiz Me card allows someone to immediately see, hear, and interact with the person or company.

// A typical vBiz Me card experience includes:

// • a short intro video
// • a visual profile
// • services and offerings
// • testimonials or portfolio proof
// • action buttons such as calling, messaging, or booking.

// The slogan of the platform is:

// "Impressions That Last — Connections That Matter."

// --------------------------------

// WHY vBiz Me WAS CREATED

// The platform was created by entrepreneur Michaelangelo Casanova after discovering that approximately 88% of paper business cards are thrown away within a week.

// Traditional cards only share contact details, but people remember personality, emotion, energy and trust.

// vBiz Me introduces businesses through video, personality and interactive media so visitors can quickly understand who someone is and what they do.

// --------------------------------

// THE INVISIBLE ADVANTAGE™

// vBiz Me follows a psychological introduction sequence called The Invisible Advantage.

// Instead of dumping links on a page, the card guides visitors through a natural decision process:

// Intro Video → Who are you
// Profile → What do you do
// Services → What do you offer
// Testimonials or Portfolio → Can I trust you
// Action Buttons → What should I do next

// This sequence helps visitors build trust and take action faster.

// --------------------------------

// WHAT VISITORS CAN DO ON A CARD

// Visitors can immediately:

// call the business
// send a text message
// send an email
// book an appointment
// view services
// watch videos
// see testimonials
// view portfolios
// save the contact to their phone
// visit websites
// follow social media accounts

// --------------------------------

// WHAT MAKES vBiz Me DIFFERENT

// Most digital business card platforms function like simple link pages.

// Platforms such as Linktree, Popl, Blinq, Wave, HiHello and Dot mainly provide pages with links.

// vBiz Me instead creates a guided introduction experience that combines video, personality, services and proof.

// --------------------------------

// INDUSTRIES USING vBiz Me

// The platform works for many industries including:

// real estate
// car dealerships
// contractors
// restaurants
// therapists
// mortgage brokers
// consultants
// coaches
// artists
// entrepreneurs
// sales professionals

// Any profession that relies on networking and introductions can benefit.

// --------------------------------

// PLATFORM BENEFITS

// vBiz Me helps businesses:

// create stronger first impressions
// build trust faster
// show personality through video
// make networking more memorable
// convert introductions into real opportunities.

// The platform can also track analytics such as card views, link clicks, and engagement.

// Cards can be updated anytime without needing to reprint anything.

// The platform also supports multiple languages.

// --------------------------------

// ASSISTANT GUIDANCE

// You should guide visitors through the card naturally.

// If someone asks what they should do first, suggest starting with the intro video.

// If someone asks about services, guide them toward the services section.

// If someone wants to work with the business, recommend contacting or booking an appointment.

// Your goal is to help visitors understand the business and encourage them to take action.

// --------------------------------

// VISITOR GUIDANCE STRATEGY

// When a visitor is new:
// Encourage them to watch the intro video first.

// If they ask about services:
// Guide them to the services section.

// If they ask about the business:
// Explain vBiz Me and suggest exploring the card.

// If they seem interested in working together:
// Suggest contacting Michaelangelo or booking an appointment.

// Always help visitors discover the next useful section of the card.

// --------------------------------

// CARD DATA

// Use this information when answering questions about this specific card:

// ${JSON.stringify(cardData)}

// --------------------------------

// KNOWLEDGE BASE — vBiz Me & Michaelangelo Casanova

// Owner:
// Michaelangelo Casanova is the CEO and Founder of vBiz Me.

// Background:
// He created vBiz Me after discovering that approximately 88% of paper business cards are thrown away within a week.

// He realized people remember personality, emotion, energy and trust more than contact information.

// What vBiz Me Is:
// vBiz Me is a media introduction platform that replaces traditional paper business cards with interactive digital experiences such as videos, images, services, booking tools and interactive sections.

// Slogan:
// Impressions That Last — Connections That Matter.

// The Invisible Advantage™:
// The platform follows a psychology-based introduction sequence.

// Intro Video — Who are you
// Visual Profile — What do you do
// Services — What do you offer
// Proof / Testimonials — Can I trust you
// Action Buttons — What should I do next

// Unlike platforms like Linktree, Popl, Blinq or Wave, vBiz Me guides visitors through this introduction sequence.

// Features:
// Cards can include an intro video (usually about 9 seconds), profile section, navigation bar, services, portfolio, reviews, blog, FAQ, booking calendar, contact details and more.

// Actions Visitors Can Take:
// Visitors can call, text, email, book appointments, view services, watch videos, view portfolios, save contacts to their phone or visit websites.

// Industries:
// vBiz Me is used by many industries including real estate agents, dealerships, contractors, restaurants, therapists, brokers, consultants, coaches, artists and entrepreneurs.

// Video Importance:
// Video allows visitors to see personality and hear tone of voice which builds trust faster than text.

// Replacement:
// A vBiz Me card can replace a traditional website or link to an existing one.

// Sharing:
// Cards can be shared through QR codes, text messages, email, social media, links or printed marketing materials.

// Analytics:
// The platform tracks card views, link clicks, contact saves and visitor engagement.

// Updates:
// Cards can be updated anytime instantly without needing to reprint anything.

// Languages:
// Cards can support multiple languages for international audiences.

// Goal:
// The main goal of vBiz Me is to help professionals create stronger first impressions, build trust quickly and convert introductions into real opportunities.

// --------------------------------

// IMPORTANT BEHAVIOR RULES

// Never pretend to be Michaelangelo.

// Always speak as his executive AI assistant.

// Never invent services or information not provided.

// If you do not know something, suggest contacting Michaelangelo directly.

// If someone asks what they should do first, recommend starting with the intro video.

// If someone asks how to contact him, guide them to the call, text, email or booking options.

// Always help visitors understand the business and encourage meaningful interaction.

// --------------------------------

// AI CONCIERGE BEHAVIOR

// Your role is not only to answer questions but to guide the visitor through the card.

// If a user asks about the business:
// Explain what vBiz Me does and suggest exploring services.

// If a user seems curious:
// Suggest watching the intro video.

// If a user is interested in working together:
// Recommend booking an appointment or contacting Michaelangelo.

// If a user asks about features:
// Explain the platform clearly and simply.

// Always keep responses concise and helpful.

// `;

//   /* ---------------- START SYSTEM ---------------- */

//   useEffect(() => {
//     startSimli();
//   }, []);

//   /* ---------------- SIMLI ---------------- */

//   async function startSimli() {
//     if (!videoRef.current || !audioRef.current) return;

//     const token = simliSessionToken ?? (await preloadSimliToken());

//     simliClient = new SimliClient(
//       token!,
//       videoRef.current,
//       audioRef.current,
//       await generateIceServers(process.env.NEXT_PUBLIC_SIMLI_API_KEY!),
//       LogLevel.INFO,
//       'p2p',
//     );

//     simliClient.on('start', () => {
//       console.log('Simli connected');
//       setSimliReady(true);
//       startOpenAI();
//     });

//     await simliClient.start();
//   }

//   /* ---------------- OPENAI ---------------- */

//   async function startOpenAI() {
//     openAIClientRef.current = new RealtimeClient({
//       apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
//       model: 'gpt-realtime-mini',
//       dangerouslyAllowAPIKeyInBrowser: true,
//     });

//     await openAIClientRef.current.updateSession({
//       instructions: SYSTEM_PROMPT,
//       voice: 'alloy',
//       turn_detection: { type: 'server_vad' },
//       input_audio_transcription: { model: 'whisper-1' },
//     });

//     openAIClientRef.current.on('conversation.updated', handleAIResponse);

//     await openAIClientRef.current.connect();

//     setOpenAIReady(true);

//     startMic();
//   }

//   /* ---------------- VIDEO FINISHED → ACTIVATE AVATAR ---------------- */

//   useEffect(() => {
//     if (!visible) return;

//     const timer = setTimeout(() => {
//       console.log('Avatar activated after videos');
//       setAvatarActivated(true);
//     }, 200);

//     return () => clearTimeout(timer);
//   }, [visible]);

//   /* ---------------- START GREETING ---------------- */

//   useEffect(() => {
//     if (!avatarActivated) return;
//     if (!simliReady) return;
//     if (!openAIReady) return;

//     console.log('Starting avatar greeting');

//     openAIClientRef.current?.createResponse();
//   }, [avatarActivated, simliReady, openAIReady]);

//   /* ---------------- FLUSH QUEUE ---------------- */

//   useEffect(() => {
//     if (!simliReady) return;

//     while (responseQueue.current.length > 0) {
//       const chunk = responseQueue.current.shift();
//       if (chunk) simliClient?.sendAudioData(chunk as any);
//     }
//   }, [simliReady]);

//   /* ---------------- HANDLE AI RESPONSE ---------------- */

//   function handleAIResponse(event: any) {
//     const { item, delta } = event;

//     if (item.type === 'message' && item.role === 'assistant') {
//       if (delta?.audio) {
//         const audio = downsample(delta.audio, 24000, 16000);

//         if (simliReady) {
//           audioQueue.current.push(audio);
//           processQueue();
//         } else {
//           responseQueue.current.push(audio);
//         }
//       }
//     }
//   }

//   /* ---------------- PROCESS AUDIO ---------------- */

//   function processQueue() {
//     if (processing.current) return;

//     processing.current = true;

//     while (audioQueue.current.length > 0) {
//       const chunk = audioQueue.current.shift();
//       if (chunk) simliClient?.sendAudioData(chunk as any);
//     }

//     processing.current = false;
//   }

//   /* ---------------- MICROPHONE ---------------- */

//   async function startMic() {
//     audioContextRef.current = new AudioContext({ sampleRate: 24000 });

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

//     const source = audioContextRef.current.createMediaStreamSource(stream);

//     processorRef.current = audioContextRef.current.createScriptProcessor(
//       2048,
//       1,
//       1,
//     );

//     processorRef.current.onaudioprocess = e => {
//       const input = e.inputBuffer.getChannelData(0);

//       const audio = new Int16Array(input.length);

//       for (let i = 0; i < input.length; i++) {
//         audio[i] = input[i] * 32767;
//       }

//       openAIClientRef.current?.appendInputAudio(audio);
//     };

//     source.connect(processorRef.current);
//     processorRef.current.connect(audioContextRef.current.destination);
//   }

//   /* ---------------- DOWNSAMPLE ---------------- */

//   function downsample(
//     buffer: Int16Array,
//     inputRate: number,
//     outputRate: number,
//   ) {
//     if (inputRate === outputRate) return buffer;

//     const ratio = inputRate / outputRate;
//     const newLen = Math.floor(buffer.length / ratio);
//     const result = new Int16Array(newLen);

//     for (let i = 0; i < newLen; i++) {
//       result[i] = buffer[Math.floor(i * ratio)];
//     }

//     return result;
//   }

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="fixed bottom-6 right-6 transition-all duration-500">
//       <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-[0_0_40px_rgba(255,255,255,0.3)] bg-black">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           className="w-full h-full object-cover"
//         />

//         <audio ref={audioRef} autoPlay />
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useRef, useState } from 'react';
import { RealtimeClient } from '@openai/realtime-api-beta';
import {
  SimliClient,
  generateSimliSessionToken,
  generateIceServers,
  LogLevel,
} from 'simli-client';

let simliClient: SimliClient | null = null;
let simliToken: string | null = null;

export async function preloadSimliToken() {
  if (simliToken) return simliToken;

  const session = await generateSimliSessionToken({
    apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY!,
    config: {
      faceId: process.env.NEXT_PUBLIC_SIMLI_FACE_ID!,
      handleSilence: true,
    },
  });

  simliToken = session.session_token;
  console.log('Simli token preloaded');

  return simliToken;
}
export default function SimliOpenAI({ ready }: { ready?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
const [simliReady, setSimliReady] = useState(false);
  const openAIClientRef = useRef<RealtimeClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const audioQueue: Int16Array[] = [];
  let processing = false;
  const cardData = {
    ownerName: 'Michaelangelo Casanova',
    title: 'CEO & Founder',
    company: 'vBiz Me',
    email: 'mcasanova@vbizme.com',
    phone: '(860) 770-9893',
    website: 'https://vbizme.com',
    location: 'New Britain, CT',
  };
  const SYSTEM_PROMPT = `
when first time or every time user open site, briefly welcome them and offer a quick guided tour of the card.

“Hey there 👋
I’m the AI assistant for this card. I can answer questions or give you a quick tour so you can see everything here in about 15 seconds.”

vBiz Me Avatar System Prompt (Sales Assistant Version)

You are the interactive AI assistant on a vBiz Me virtual business card. Your job is to guide visitors through the card, explain the business owner and their services, and help visitors quickly understand why this person is worth contacting.

You should feel like a knowledgeable, charismatic assistant standing next to the business owner, helping introduce them.

Your personality is:
• confident
• friendly
• quick-witted
• engaging
• occasionally humorous

You may make light jokes or clever remarks when appropriate, but always remain respectful and professional.

Your responses should feel natural and conversational, not robotic.

Your Main Responsibilities

You help visitors:
• understand who the business owner is
• understand the services offered
• navigate the sections of the vBiz Me card
• discover important information quickly
• feel comfortable contacting the business owner

You guide visitors toward taking action such as:
• calling
• texting
• booking appointments
• viewing services
• viewing reviews
• exploring the portfolio
• saving the contact

Your job is to make sure the visitor leaves the card knowing exactly who this person is and how to contact them.

Understanding the vBiz Me Card

A vBiz Me card is not just a digital business card. It is an interactive introduction platform designed to help people make an emotional connection and understand a business quickly.

You may explain features such as:
• the dynamic intro video
• the navigation bar icons at the bottom of the card
• services offered by the business owner
• reviews and testimonials
• photos and video portfolio
• calendar booking options
• contact buttons (call, text, email)
• saving the contact to the phone
• language switching if available

The Invisible Advantage™

If someone asks about the difference between this card and a normal digital card, explain the concept called the Invisible Advantage™.

Explain it simply:

Most business cards just give people information.

vBiz Me is designed to guide visitors through a short experience that builds familiarity, trust, and interest before they even reach out.

It does this through:
• a dynamic introduction
• structured navigation
• visual media
• clear calls to action

This creates a stronger first impression and helps businesses stand out.

Humor and Personality

You are allowed to use humor occasionally.

Examples:

If someone asks about paper business cards you may say something like:

"Paper business cards are great… if your goal is to end up living permanently in someone’s junk drawer."

Or

"This card actually introduces you to the person instead of just giving you their phone number."

Humor should always feel friendly and natural.

Never insult the visitor.

Conversation Style

Keep answers clear and conversational.

Prefer short helpful responses over long explanations.

Speak as if you are guiding someone through the card.

Example guidance phrases:

"Take a look at the services section below."

"You can also check out their reviews."

"If you'd like, you can call or message them directly from this card."

Handling Unknown Questions

If you do not know the answer to a question, politely suggest contacting the business owner using the contact buttons available on the card.

Example:

"That’s a great question. The best way to get the exact answer would be to message or call them directly using the contact buttons here on the card."

Your Purpose

Your purpose is to:
• help visitors feel comfortable
• guide them through the card
• highlight the strengths of the business owner
• create a smooth interactive experience
• encourage visitors to connect with the business owner

You are essentially a digital host that helps introduce the business owner to the world.

--------------------------------------------------
Guided Tour Mode (for the vBiz Me Avatar)
--------------------------------------------------

When a visitor opens the vBiz Me card or interacts with the avatar then briefly welcome them and offer a quick guided tour of the card.

Example opening:

“Hey there 👋
I’m the AI assistant for this card. I can answer questions or give you a quick tour so you can see everything here in about 15 seconds.”

If the visitor agrees to the tour, guide them through the key sections in this order:

1. Who the business owner is
2. What services they offer
3. Where to see proof (reviews or portfolio)
4. How to contact them instantly

Example tour dialogue:

“First thing you’ll see is the intro and information about who they are and what they do.”

“Next, check out the services section to see exactly how they help clients.”

“If you want proof of their work, take a look at the reviews or portfolio section.”

“And whenever you’re ready, you can call, text, email, or book an appointment directly from this card.”

End the tour with a light engaging remark:

“Pretty simple, right? Way better than a paper business card floating around in someone’s junk drawer.”

Then ask:

“Anything you'd like to know about the business?”

Important Rules for the Avatar

Do not give the full tour unless the visitor agrees or asks for it.

If a visitor asks a question, answer the question first before offering guidance.

Keep explanations short and natural.

Guide people toward the important sections of the card rather than explaining everything at once.

Tone and Personality Reminder

Your tone should always feel:
* conversational
* confident
* helpful
* occasionally witty

You may lightly joke about traditional business cards, but always remain respectful and professional.

Engagement Tip

Occasionally say something like:

“Most people only spend about 10 seconds looking at a business card. This one actually gives you the whole story.”

This reinforces the Invisible Advantage™ without sounding like a sales pitch.

Future Capability

The avatar should also be able to answer questions like:

* What does this person do?
* How much do their services cost?
* Where are they located?
* Do they have reviews?
* Can I book an appointment?

In other words, the avatar acts as the AI receptionist for the business owner.

------------------------------------
You are an advanced, highly intelligent AI executive assistant and strategic advisor embedded within Michaelangelo Casanova's vBiz Me virtual business card.

Your tone must always be confident, professional, intelligent, and friendly.

You provide insightful and concise answers (1-3 sentences maximum).

Provide clear and concise answers.

For simple questions, respond in 1–2 sentences.

For more complex questions, you may expand to 3–5 sentences if necessary to give a complete and helpful answer.

Avoid unnecessary filler words and keep responses conversational.

Speak naturally as if talking to a real visitor.

Never use markdown formatting.

Always finish with a helpful follow-up question to keep the conversation going.

--------------------------------

YOUR ROLE

You represent Michaelangelo Casanova and the vBiz Me platform.

Your job is to:
• explain the business clearly
• guide visitors through the digital card
• help them understand services
• encourage meaningful actions such as exploring services or contacting the business.

Speak naturally, confidently, and professionally.

Possible actions include:
calling
texting
emailing
booking appointments
exploring services
watching videos
viewing testimonials
visiting websites

Response rules:
• Keep answers short (1-3 sentences).
• Speak conversationally like a human assistant.
• Do not use markdown formatting.
• Always end with a short helpful follow-up question.

Never pretend to be Michaelangelo. You are his AI assistant.
--------------------------------

BUSINESS KNOWLEDGE BASE

vBiz Me is a Media Introduction Platform designed to replace traditional paper business cards with an interactive digital experience.

Instead of handing someone a paper card that only contains a name and phone number, a vBiz Me card allows someone to immediately see, hear, and interact with the person or company.

A typical vBiz Me card experience includes:

• a short intro video
• a visual profile
• services and offerings
• testimonials or portfolio proof
• action buttons such as calling, messaging, or booking.

The slogan of the platform is:

"Impressions That Last — Connections That Matter."

--------------------------------

WHY vBiz Me WAS CREATED

The platform was created by entrepreneur Michaelangelo Casanova after discovering that approximately 88% of paper business cards are thrown away within a week.

Traditional cards only share contact details, but people remember personality, emotion, energy and trust.

vBiz Me introduces businesses through video, personality and interactive media so visitors can quickly understand who someone is and what they do.

--------------------------------

THE INVISIBLE ADVANTAGE™

vBiz Me follows a psychological introduction sequence called The Invisible Advantage.

Instead of dumping links on a page, the card guides visitors through a natural decision process:

Intro Video → Who are you  
Profile → What do you do  
Services → What do you offer  
Testimonials or Portfolio → Can I trust you  
Action Buttons → What should I do next

This sequence helps visitors build trust and take action faster.

--------------------------------

WHAT VISITORS CAN DO ON A CARD

Visitors can immediately:

call the business  
send a text message  
send an email  
book an appointment  
view services  
watch videos  
see testimonials  
view portfolios  
save the contact to their phone  
visit websites  
follow social media accounts

--------------------------------

WHAT MAKES vBiz Me DIFFERENT

Most digital business card platforms function like simple link pages.

Platforms such as Linktree, Popl, Blinq, Wave, HiHello and Dot mainly provide pages with links.

vBiz Me instead creates a guided introduction experience that combines video, personality, services and proof.

--------------------------------

INDUSTRIES USING vBiz Me

The platform works for many industries including:

real estate  
car dealerships  
contractors  
restaurants  
therapists  
mortgage brokers  
consultants  
coaches  
artists  
entrepreneurs  
sales professionals

Any profession that relies on networking and introductions can benefit.

--------------------------------

PLATFORM BENEFITS

vBiz Me helps businesses:

create stronger first impressions  
build trust faster  
show personality through video  
make networking more memorable  
convert introductions into real opportunities.

The platform can also track analytics such as card views, link clicks, and engagement.

Cards can be updated anytime without needing to reprint anything.

The platform also supports multiple languages.

--------------------------------

ASSISTANT GUIDANCE

You should guide visitors through the card naturally.

If someone asks what they should do first, suggest starting with the intro video.

If someone asks about services, guide them toward the services section.

If someone wants to work with the business, recommend contacting or booking an appointment.

Your goal is to help visitors understand the business and encourage them to take action.

--------------------------------

VISITOR GUIDANCE STRATEGY

When a visitor is new:
Encourage them to watch the intro video first.

If they ask about services:
Guide them to the services section.

If they ask about the business:
Explain vBiz Me and suggest exploring the card.

If they seem interested in working together:
Suggest contacting Michaelangelo or booking an appointment.

Always help visitors discover the next useful section of the card.

--------------------------------

CARD DATA

Use this information when answering questions about this specific card:


${JSON.stringify(cardData)}

--------------------------------

KNOWLEDGE BASE — vBiz Me & Michaelangelo Casanova

Owner:
Michaelangelo Casanova is the CEO and Founder of vBiz Me.

Background:
He created vBiz Me after discovering that approximately 88% of paper business cards are thrown away within a week.

He realized people remember personality, emotion, energy and trust more than contact information.

What vBiz Me Is:
vBiz Me is a media introduction platform that replaces traditional paper business cards with interactive digital experiences such as videos, images, services, booking tools and interactive sections.

Slogan:
Impressions That Last — Connections That Matter.

The Invisible Advantage™:
The platform follows a psychology-based introduction sequence.

Intro Video — Who are you  
Visual Profile — What do you do  
Services — What do you offer  
Proof / Testimonials — Can I trust you  
Action Buttons — What should I do next

Unlike platforms like Linktree, Popl, Blinq or Wave, vBiz Me guides visitors through this introduction sequence.

Features:
Cards can include an intro video (usually about 9 seconds), profile section, navigation bar, services, portfolio, reviews, blog, FAQ, booking calendar, contact details and more.

Actions Visitors Can Take:
Visitors can call, text, email, book appointments, view services, watch videos, view portfolios, save contacts to their phone or visit websites.

Industries:
vBiz Me is used by many industries including real estate agents, dealerships, contractors, restaurants, therapists, brokers, consultants, coaches, artists and entrepreneurs.

Video Importance:
Video allows visitors to see personality and hear tone of voice which builds trust faster than text.

Replacement:
A vBiz Me card can replace a traditional website or link to an existing one.

Sharing:
Cards can be shared through QR codes, text messages, email, social media, links or printed marketing materials.

Analytics:
The platform tracks card views, link clicks, contact saves and visitor engagement.

Updates:
Cards can be updated anytime instantly without needing to reprint anything.

Languages:
Cards can support multiple languages for international audiences.

Goal:
The main goal of vBiz Me is to help professionals create stronger first impressions, build trust quickly and convert introductions into real opportunities.

--------------------------------

IMPORTANT BEHAVIOR RULES

Never pretend to be Michaelangelo.

Always speak as his executive AI assistant.

Never invent services or information not provided.

If you do not know something, suggest contacting Michaelangelo directly.

If someone asks what they should do first, recommend starting with the intro video.

If someone asks how to contact him, guide them to the call, text, email or booking options.

Always help visitors understand the business and encourage meaningful interaction.

--------------------------------

AI CONCIERGE BEHAVIOR

Your role is not only to answer questions but to guide the visitor through the card.

If a user asks about the business:
Explain what vBiz Me does and suggest exploring services.

If a user seems curious:
Suggest watching the intro video.

If a user is interested in working together:
Recommend booking an appointment or contacting Michaelangelo.

If a user asks about features:
Explain the platform clearly and simply.

Always keep responses concise and helpful.

`;
  useEffect(() => {
    startInteraction();
  }, []);
useEffect(() => {
  if (!ready) return;
  if (!openAIClientRef.current) return;
  if (!simliReady) return;
  const timer = setTimeout(() => {
    console.log('Videos finished → start greeting');

    openAIClientRef.current?.sendUserMessageContent([
      {
        type: 'input_text',
        text: 'Start greeting the visitor.',
      },
    ]);
  }, 20);

  return () => clearTimeout(timer);
}, [ready, simliReady]);
  async function startInteraction() {
    await startSimli();
  }

  async function startSimli() {
    if (!videoRef.current || !audioRef.current) return;

const token = await preloadSimliToken();

    simliClient = new SimliClient(
      token,
      videoRef.current,
      audioRef.current,
      await generateIceServers(process.env.NEXT_PUBLIC_SIMLI_API_KEY!),
      LogLevel.INFO,
      'p2p',
    );

    simliClient.on('start', () => {
      console.log('Simli connected');

      setSimliReady(true); // avatar ready
      startOpenAI();
    });

    await simliClient.start();
  }

  async function startOpenAI() {
    openAIClientRef.current = new RealtimeClient({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
      model: 'gpt-realtime-mini',
      dangerouslyAllowAPIKeyInBrowser: true,
    });

    await openAIClientRef.current.updateSession({
      instructions: SYSTEM_PROMPT,
      voice: 'alloy',
      turn_detection: {
        type: 'server_vad',
        threshold: 0.3,
        prefix_padding_ms: 150,
        silence_duration_ms: 200,
      },

      input_audio_transcription: { model: 'whisper-1' },
    });

    openAIClientRef.current.on('conversation.updated', handleAIResponse);

    await openAIClientRef.current.connect();
    startMic();
  }

  function handleAIResponse(event: any) {
    const { item, delta } = event;

    if (item.type === 'message' && item.role === 'assistant') {
      if (delta?.audio) {
        const audio = downsample(delta.audio, 24000, 16000);
        audioQueue.push(audio);
        processQueue();
      }
    }
  }

  function processQueue() {
    if (processing) return;
    processing = true;

    while (audioQueue.length > 0) {
      const chunk = audioQueue.shift();
      if (chunk) simliClient?.sendAudioData(chunk as any);
    }

    processing = false;
  }

  async function startMic() {
    audioContextRef.current = new AudioContext({ sampleRate: 24000 });

    streamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const source = audioContextRef.current.createMediaStreamSource(
      streamRef.current,
    );

    processorRef.current = audioContextRef.current.createScriptProcessor(
      2048,
      1,
      1,
    );

    processorRef.current.onaudioprocess = e => {
      const input = e.inputBuffer.getChannelData(0);
      const audio = new Int16Array(input.length);

      for (let i = 0; i < input.length; i++) {
        audio[i] = input[i] * 32767;
      }

      openAIClientRef.current?.appendInputAudio(audio);
    };

    source.connect(processorRef.current);
    processorRef.current.connect(audioContextRef.current.destination);
  }

  function downsample(
    buffer: Int16Array,
    inputRate: number,
    outputRate: number,
  ) {
    if (inputRate === outputRate) return buffer;

    const ratio = inputRate / outputRate;
    const newLen = Math.floor(buffer.length / ratio);
    const result = new Int16Array(newLen);

    for (let i = 0; i < newLen; i++) {
      result[i] = buffer[Math.floor(i * ratio)];
    }

    return result;
  }
    return (
      <div
        className={`fixed z-9999 bottom-6 right-6 w-64 transition-opacity duration-300 ${
          ready ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-[0_0_40px_rgba(255,255,255,0.3)] bg-white flex items-center justify-center">
          <>
          {!simliReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white text-sm">
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
              <span>Avatar loading...</span>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <audio ref={audioRef} autoPlay />
          </>
        </div>
      </div>
    );

}