import React, { useState, useEffect, useRef } from 'react';
import { Heart, Mail, Music, Gift, Sparkles, X } from 'lucide-react';

function App() {
  const [showLoveScreen, setShowLoveScreen] = useState(false);
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [loveCounter, setLoveCounter] = useState('');
  const [isHeartExploding, setIsHeartExploding] = useState(false);
  
  const loveStartDate = useRef(new Date('2025-04-13'));
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const heartIntervalRef = useRef(null);
  const musicIntervalRef = useRef(null);

  // Temizlik fonksiyonu
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      clearIntervals();
    };
  }, []);

  const clearIntervals = () => {
    if (heartIntervalRef.current) clearInterval(heartIntervalRef.current);
    if (musicIntervalRef.current) clearInterval(musicIntervalRef.current);
  };

  useEffect(() => {
    if (showLoveScreen) {
      createFloatingHearts();
      createMusicNotes();
      startLoveCounter();
    } else {
      clearIntervals();
    }
  }, [showLoveScreen]);

  const startLoveCounter = () => {
    const updateCounter = () => {
      const now = new Date();
      const timeDiff = now - loveStartDate.current;
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setLoveCounter(`${days} gün, ${hours} saat, ${minutes} dakika, ${seconds} saniye ❤️`);
    };
    
    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  };

  const showLove = () => {
    playRomanticMusic();
    setShowLoveScreen(true);
  };

  const showSurprise = () => {
    alert('🎉 Sürpriz: Seni dünyada en çok seven kişi benim! Her gün sana daha çok aşık oluyorum! ❤️');
    createHeartExplosion();
  };

  const playLoveSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    
    const melody = [
      { freq: 523.25, duration: 0.6 }, // C5
      { freq: 587.33, duration: 0.6 }, // D5
      { freq: 659.25, duration: 0.6 }, // E5
      { freq: 698.46, duration: 0.6 }, // F5
      { freq: 783.99, duration: 1.2 }, // G5
      { freq: 659.25, duration: 0.6 }, // E5
      { freq: 587.33, duration: 0.6 }, // D5
      { freq: 523.25, duration: 1.2 }, // C5
      { freq: 659.25, duration: 0.6 }, // E5
      { freq: 783.99, duration: 0.6 }, // G5
      { freq: 880.00, duration: 1.2 }, // A5
      { freq: 783.99, duration: 2.4 }, // G5
    ];
    
    let currentTime = audioContext.currentTime;
    
    melody.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(note.freq, currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + note.duration);
      
      currentTime += note.duration;
    });
  };

  const createHeartExplosion = () => {
    if (isHeartExploding) return;
    setIsHeartExploding(true);
    
    const colors = ['#ff6b6b', '#ff8e8e', '#ffa8a8', '#ffb3b3', '#ffc1c1'];
    const hearts = [];
    
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.className = 'heart-explosion';
        heart.style.position = 'fixed';
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.fontSize = `${Math.random() * 30 + 20}px`;
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(heart);
        hearts.push(heart);
        
        const angle = (Math.PI * 2 * i) / 30;
        const velocity = Math.random() * 300 + 200;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0, y = 0;
        const gravity = 500;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = (Date.now() - startTime) / 1000;
          x = vx * elapsed;
          y = vy * elapsed + 0.5 * gravity * elapsed * elapsed;
          
          heart.style.transform = `translate(${x}px, ${y}px) rotate(${elapsed * 360}deg)`;
          heart.style.opacity = Math.max(0, 1 - elapsed / 3);
          
          if (elapsed < 3) {
            animationRef.current = requestAnimationFrame(animate);
          } else {
            heart.remove();
          }
        };
        
        animate();
      }, i * 50);
    }
    
    setTimeout(() => setIsHeartExploding(false), 3000);
  };

  const playRomanticMusic = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const audioContext = audioContextRef.current;
    
    const melody = [
      { freq: 523.25, duration: 0.5 }, // C5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 698.46, duration: 0.5 }, // F5
      { freq: 783.99, duration: 1.0 }, // G5
      { freq: 659.25, duration: 0.5 }, // E5
      { freq: 587.33, duration: 0.5 }, // D5
      { freq: 523.25, duration: 1.0 }, // C5
    ];
    
    let currentTime = audioContext.currentTime;
    
    const playMelody = () => {
      melody.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(note.freq, currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);
        
        currentTime += note.duration;
      });
      
      setTimeout(() => {
        if (showLoveScreen) {
          currentTime = audioContext.currentTime;
          playMelody();
        }
      }, 3000);
    };
    
    playMelody();
  };

  const createFloatingHearts = () => {
    const heartSymbols = ['❤️', '💕', '💖', '💗', '💝', '💘', '💞', '💓'];
    
    const addHeart = () => {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.position = 'fixed';
      heart.style.fontSize = '25px';
      heart.style.color = 'rgba(255, 107, 107, 0.8)';
      heart.style.left = `${Math.random() * 100}%`;
      heart.style.animation = `float ${Math.random() * 3 + 4}s linear forwards`;
      heart.style.pointerEvents = 'none';
      heart.style.zIndex = '-1';
      
      document.body.appendChild(heart);
      
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 7000);
    };
    
    heartIntervalRef.current = setInterval(addHeart, 200);
    
    for(let i = 0; i < 15; i++) {
      setTimeout(addHeart, i * 100);
    }
  };

  const createMusicNotes = () => {
    const musicSymbols = ['♪', '♫', '♬', '♩', '♭', '♯', '𝄞'];
    
    const addMusicNote = () => {
      const note = document.createElement('div');
      note.className = 'music-note';
      note.innerHTML = musicSymbols[Math.floor(Math.random() * musicSymbols.length)];
      note.style.position = 'fixed';
      note.style.color = 'rgba(255, 255, 255, 0.7)';
      note.style.fontSize = '28px';
      note.style.left = `${Math.random() * 100}%`;
      note.style.animation = `musicFloat ${Math.random() * 2 + 5}s linear forwards`;
      note.style.animationDelay = `${Math.random() * 2}s`;
      note.style.pointerEvents = 'none';
      
      document.body.appendChild(note);
      
      setTimeout(() => {
        if (note.parentNode) {
          note.parentNode.removeChild(note);
        }
      }, 9000);
    };
    
    musicIntervalRef.current = setInterval(addMusicNote, 600);
  };

  // Yardımcı bileşenler
  const InitialScreen = () => (
    <div className="initial-screen">
      <h1 className="text-white text-4xl sm:text-6xl mb-6 sm:mb-8 font-bold glow-text">
        Burcu ❤️
      </h1>
      <div 
        className="heart-container relative mx-auto my-8 sm:my-12 w-40 h-40 sm:w-56 sm:h-56 cursor-pointer transition-all duration-300 hover:scale-110 hover:brightness-125"
        onClick={showLove}
        aria-label="Sevgini göster"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && showLove()}
      >
        <div className="heartbeat">
          <Heart 
            size={window.innerWidth < 640 ? 80 : 120} 
            className="text-red-400 fill-red-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              filter: 'drop-shadow(0 0 25px rgba(255, 107, 107, 0.8))'
            }}
          />
        </div>
      </div>
      <p className="text-white text-lg sm:text-xl mt-4 sm:mt-6 pulse-text font-medium px-4">
        Kalbe tıkla ve sürprizi gör! 💕
      </p>
    </div>
  );

  const LoveScreen = () => (
    <div className="love-screen">
      <div className="text-center mb-6 sm:mb-8">
        <button
          onClick={() => setShowLetterModal(true)}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 sm:gap-3 mx-auto"
          aria-label="Mektubu oku"
        >
          <Mail size={20} />
          💌 Mektup Oku
        </button>
      </div>

      <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 sm:mb-8 shadow-2xl backdrop-blur-sm">
        <h3 className="text-purple-600 text-2xl sm:text-4xl mb-4 sm:mb-6 text-center font-bold">
          Seninle Yaşadığım En Güzel Anlar 💕
        </h3>
        <ul className="space-y-3 sm:space-y-4">
          {[
            "🌅 İlk Gördüğüm an o büyülü an - kalbim hala aynı hızla çarpıyor",
            "☕ Birlikte sabaha kadar telefonla görüştüğümüz gün",
            "🌙 Yıldızları bakarak düşündüğüm o geceler",
            "😂 Birlikte güldüğümüz tüm o güzel anlar",
            "🤗 Keşke seni sarabilseydim"
          ].map((memory, index) => (
            <li 
              key={index}
              className="memory-item bg-gradient-to-r from-yellow-200 to-orange-200 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-gray-800 text-base sm:text-lg shadow-md"
            >
              {memory}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 p-6 sm:p-8 bg-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-md">
        {[
          "📸\nBuraya senin\nen güzel fotoğrafın\ngelecek ❤️",
          "📸\nBirlikte çektiğimiz\no harika fotoğraf\n💕",
          "📸\nGülüşünün\nen güzel hali\n😊"
        ].map((text, index) => (
          <div 
            key={index}
            className="h-40 sm:h-48 bg-gradient-to-br from-pink-300 to-purple-300 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-base sm:text-lg text-center shadow-lg hover:scale-105 transition-transform duration-300"
          >
            {text}
          </div>
        ))}
      </div>

      <div className="bg-white/95 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 text-center shadow-2xl">
        <h3 className="text-purple-600 text-2xl sm:text-3xl mb-4 sm:mb-5 font-bold">
          Seni Seveli Geçen Süre ⏰
        </h3>
        <div className="text-red-500 text-xl sm:text-3xl font-bold break-words">
          {loveCounter || 'Hesaplanıyor... ❤️'}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 sm:mb-8 text-center shadow-2xl">
        <h3 className="text-2xl sm:text-4xl mb-4 sm:mb-6 font-bold">
          Sana Verdiğim Sözler 💍
        </h3>
        <p className="text-base sm:text-xl leading-relaxed italic">
          Seni her gün daha çok seveceğim, yanında olacağım, 
          gülümsemeni sağlayacağım ve hayallerini gerçekleştirmek için 
          elimden geleni yapacağım. Sen benim en değerli hazinemsin! ✨
        </p>
      </div>

      <div className="button-grid flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
        <button
          onClick={showSurprise}
          className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 justify-center"
          aria-label="Özel sürpriz"
        >
          <Gift size={18} />
          🎁 Özel Sürpriz
        </button>
        <button
          onClick={playLoveSound}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 justify-center"
          aria-label="Aşk melodisini çal"
        >
          <Music size={18} />
          🎵 Aşk Melodisi
        </button>
        <button
          onClick={createHeartExplosion}
          disabled={isHeartExploding}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 sm:px-6 py-3 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 justify-center disabled:opacity-50"
          aria-label="Kalp patlaması oluştur"
        >
          <Sparkles size={18} />
          {isHeartExploding ? '💥 Patlıyor...' : '💥 Kalp Patlaması'}
        </button>
      </div>
    </div>
  );

  const LetterModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="modal-content bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        <button
          onClick={() => setShowLetterModal(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 transition-colors p-1"
          aria-label="Mektubu kapat"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-4 sm:mb-6 pr-8">
          <h2 className="modal-title text-purple-600 text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">
            Canım Burcu'ma ❤️
          </h2>
        </div>
        
        <div className="modal-text text-gray-700 text-base sm:text-lg leading-relaxed space-y-4 sm:space-y-5">
          <p className="indent-4 sm:indent-5">Merhaba güzel kalbim,</p>
          <p className="indent-4 sm:indent-5">
            Bu sayfayı sadece senin için, seni ne kadar çok sevdiğimi anlatmak için hazırladım. 
            Her gün seninle olmak, gülüşünü görmek, sesini duymak beni dünyanın en mutlu insanı yapıyor.
          </p>
          <p className="indent-4 sm:indent-5">
            Sen benim hayatımdaki en güzel şarkısın, en parlak yıldızımsın. 
            Seninle geçirdiğim her an bir hediye, her gülüşün kalbimde yeni çiçekler açtırıyor.
          </p>
          <p className="indent-4 sm:indent-5">
            Seni sevmek benim için nefes almak kadar doğal, güneşin doğması kadar kesin. 
            Sen benim dünyamın rengi, hayatımın anlamısın.
          </p>
          <p className="indent-4 sm:indent-5">
            Bu küçük sürprizi beğeneceğini umarım. Sen ne kadar özelsin bil istiyorum. 
            Seni sonsuza kadar seviyorum... ❤️
          </p>
        </div>
        
        <div className="text-right mt-6 sm:mt-8">
          <div className="text-purple-600 text-lg sm:text-xl font-bold italic">
            Seni çok seven, ❤️
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center overflow-x-hidden">
      <style jsx>{`
        @keyframes glow {
          from { 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.3);
            transform: scale(1);
          }
          to { 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3), 0 0 30px rgba(255,255,255,0.6);
            transform: scale(1.02);
          }
        }

        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.15); }
          50% { transform: scale(1); }
          75% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.7; transform: scale(1); }
        }

        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes musicFloat {
          0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-120px) translateX(60px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes slideInMemory {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .glow-text {
          animation: glow 2s ease-in-out infinite alternate;
        }

        .heartbeat {
          animation: heartbeat 1.2s ease-in-out infinite;
        }

        .pulse-text {
          animation: pulse 2s infinite;
        }

        .memory-item {
          animation: slideInMemory 0.8s ease-out forwards;
        }

        .memory-item:nth-child(1) { animation-delay: 0.2s; }
        .memory-item:nth-child(2) { animation-delay: 0.4s; }
        .memory-item:nth-child(3) { animation-delay: 0.6s; }
        .memory-item:nth-child(4) { animation-delay: 0.8s; }
        .memory-item:nth-child(5) { animation-delay: 1.0s; }

        /* Performans iyileştirmeleri */
        .floating-heart, .music-note, .heart-explosion {
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translate3d(0,0,0);
        }

        /* Mobil optimizasyonları */
        @media (max-width: 768px) {
          .modal-content {
            margin: 1rem;
            max-height: 85vh;
            padding: 1.5rem;
          }
          
          .modal-title {
            font-size: 2rem;
          }
          
          .modal-text {
            font-size: 1rem;
            line-height: 1.6;
          }
          
          .button-grid {
            flex-direction: column;
            gap: 0.75rem;
          }
          
          .button-grid button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <div className="container text-center p-4 sm:p-5 max-w-4xl w-full">
        {!showLoveScreen ? <InitialScreen /> : <LoveScreen />}
      </div>

      {showLetterModal && <LetterModal />}
    </div>
  );
}

export default App;