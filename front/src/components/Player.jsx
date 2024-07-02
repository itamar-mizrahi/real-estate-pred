import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@mui/material';

const SongComponent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState(null);
  const utteranceRef = useRef(null);
  const [selectedSong, setSelectedSong] = useState('tzutz');

  const songs = {
    tzutz: {
      title: "שיר לצוץ הכלבה",
      lyrics: "צוץ, צוץ, כלבה קטנה. שחור וחום, כה חמודה. קופצת, רצה, משחקת בגינה. צוץ שלנו, ידידה נאמנה.",
      melody: [
        { note: 'C4', duration: 0.5 }, { note: 'E4', duration: 0.5 },
        { note: 'G4', duration: 0.5 }, { note: 'C5', duration: 0.5 },
        { note: 'A4', duration: 0.5 }, { note: 'G4', duration: 0.5 },
        { note: 'E4', duration: 0.5 }, { note: 'C4', duration: 0.5 },
      ],
      image: "/api/placeholder/300/200?text=צוץ הכלבה&bgColor=ffd700&textColor=000000"
    },
    birthday: {
      title: "ברכת יום הולדת 40",
      lyrics: "ארבעים שנה חלפו בן רגע, הגיע הזמן לחגוג בתענוג. חיוך על פנייך, אושר בלבך, יום הולדת שמח, שפע ברכות עלייך.",
      melody: [
        { note: 'G4', duration: 0.5 }, { note: 'G4', duration: 0.5 },
        { note: 'A4', duration: 0.5 }, { note: 'G4', duration: 0.5 },
        { note: 'C5', duration: 0.5 }, { note: 'B4', duration: 0.5 },
        { note: 'A4', duration: 1 }, { note: 'G4', duration: 0.5 },
        { note: 'G4', duration: 0.5 }, { note: 'A4', duration: 0.5 },
        { note: 'G4', duration: 0.5 }, { note: 'D5', duration: 0.5 },
        { note: 'C5', duration: 1 },
      ],
      image: "/api/placeholder/300/200?text=יום הולדת 40&bgColor=ff69b4&textColor=ffffff"
    }
  };

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(songs[selectedSong].lyrics);
    u.lang = 'he-IL';
    u.rate = 0.8;
    u.pitch = 1;
    utteranceRef.current = u;

    return () => {
      synth.cancel();
    };
  }, [selectedSong]);

  const playNote = (context, frequency, startTime, duration) => {
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.5, startTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration - 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  };

  const playMelody = (context, startTime, melody) => {
    const frequencies = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
      'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
      'D5': 587.33
    };

    let currentTime = startTime;

    // Play the melody twice
    for (let i = 0; i < 2; i++) {
      melody.forEach(({ note, duration }) => {
        playNote(context, frequencies[note], currentTime, duration);
        currentTime += duration;
      });
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      if (audioContext) {
        audioContext.close();
      }
      setIsPlaying(false);
    } else {
      const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
      setAudioContext(newAudioContext);
      
      const startTime = newAudioContext.currentTime + 0.1;
      playMelody(newAudioContext, startTime, songs[selectedSong].melody);

      const synth = window.speechSynthesis;
      synth.speak(utteranceRef.current);

      setIsPlaying(true);

      utteranceRef.current.onend = () => {
        setIsPlaying(false);
        newAudioContext.close();
      };
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-sky-800 text-center">{songs[selectedSong].title}</h2>
      <div className="flex justify-center mb-4">
        <img 
          src={songs[selectedSong].image} 
          alt={songs[selectedSong].title}
          className="rounded-lg shadow-md max-w-full h-auto"
        />
      </div>
      <div className="bg-white bg-opacity-70 p-4 rounded-md shadow-inner mb-6">
        <p className="mb-4 text-right text-sky-900" dir="rtl">
          {songs[selectedSong].lyrics.split('. ').join('.\n')}
        </p>
      </div>
      <div className="flex justify-center space-x-2 mb-4">
        <Button 
          onClick={() => setSelectedSong('tzutz')} 
          className={`bg-sky-500 hover:bg-sky-600 text-white ${selectedSong === 'tzutz' ? 'ring-2 ring-sky-300' : ''}`}
        >
          שיר צוץ
        </Button>
        <Button 
          onClick={() => setSelectedSong('birthday')} 
          className={`bg-sky-500 hover:bg-sky-600 text-white ${selectedSong === 'birthday' ? 'ring-2 ring-sky-300' : ''}`}
        >
          ברכת יום הולדת
        </Button>
      </div>
      <div className="flex justify-center">
        <Button onClick={togglePlayback} className="bg-sky-600 hover:bg-sky-700 text-white flex items-center">
          {isPlaying ? <Pause className="mr-2" size={16} /> : <Play className="mr-2" size={16} />}
          {isPlaying ? 'עצור שיר' : 'נגן שיר'}
        </Button>
      </div>
    </div>
  );
};

export default SongComponent;
