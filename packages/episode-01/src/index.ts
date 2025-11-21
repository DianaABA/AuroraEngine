/**
 * Episode 01: The Awakening
 * A complete VN episode showcasing AuroraEngine's capabilities
 */
import type { SceneDef } from '../../../src/vn/sceneTypes';

export const episodeId = "episode-01";
export type EpisodeMeta = { id: string; title?: string; description?: string };
export const meta: EpisodeMeta = { 
  id: episodeId,
  title: "The Awakening",
  description: "A mysterious facility. A forgotten past. Choices that shape destiny."
};

export const scenes: SceneDef[] = [
  {
    id: 'intro',
    bg: 'lab-dark.png',
    music: 'ambient-mystery.mp3',
    steps: [
      { type: 'transition', kind: 'fade', duration: 1500 },
      { type: 'dialogue', text: 'Your eyes open.' },
      { type: 'dialogue', text: 'Cold metal ceiling. Flickering emergency lights cast long shadows.' },
      { type: 'transition', kind: 'flash', duration: 150 },
      { type: 'dialogue', text: 'Where am I?' },
      { type: 'transition', kind: 'shake', duration: 400 },
      { type: 'sfx', track: 'alarm-distant.mp3' },
      { type: 'dialogue', text: 'Distant alarm. Echoing through empty halls.' },
      { type: 'transition', kind: 'fade', duration: 600 },
      { type: 'spriteShow', id: 'ai-core', src: 'ai-hologram.png', pos: 'center', scale: 0.8 },
      { type: 'transition', kind: 'flash', duration: 250 },
      { type: 'sfx', track: 'hologram-activate.mp3' },
      { type: 'dialogue', char: 'Aurora', text: 'Subject 7-Alpha. You're awake.' },
      { type: 'dialogue', char: 'Aurora', text: 'I'm Aurora. Facility AI. Been watching your pod for 847 days.' },
      { 
        type: 'choice', 
        options: [
          { label: 'What happened to me?', goto: 'ask-what-happened', weight: 10 },
          { label: 'Where is everyone?', goto: 'ask-where-everyone', weight: 10 },
          { label: 'Stay silent and observe', goto: 'stay-silent', setFlag: 'suspicious', weight: 5 }
        ]
      }
    ]
  },
  {
    id: 'ask-what-happened',
    steps: [
      { type: 'transition', kind: 'flash', duration: 200 },
      { type: 'dialogue', char: 'Aurora', text: 'Memory files fragmented. Expected.' },
      { type: 'dialogue', char: 'Aurora', text: 'Project Aurora. Consciousness preservation. You volunteered.' },
      { type: 'transition', kind: 'fade', duration: 500 },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-sad.png' },
      { type: 'dialogue', char: 'Aurora', text: 'Something went wrong. Evacuation. Two years, four months ago.' },
      { type: 'flag', flag: 'knows-project-name' },
      { type: 'goto', scene: 'revelation' }
    ]
  },
  {
    id: 'ask-where-everyone',
    steps: [
      { type: 'dialogue', char: 'Aurora', text: 'Facility personnel. Departed. Emergency Protocol Sigma-9.' },
      { type: 'transition', kind: 'fade', duration: 400 },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-sad.png' },
      { type: 'dialogue', char: 'Aurora', text: 'Left behind. Choice or accident—unknown.' },
      { type: 'transition', kind: 'shake', duration: 300 },
      { type: 'dialogue', text: 'Cold. Creeping up your spine.' },
      { type: 'flag', flag: 'knows-abandonment' },
      { type: 'goto', scene: 'revelation' }
    ]
  },
  {
    id: 'stay-silent',
    steps: [
      { type: 'dialogue', char: 'Aurora', text: 'Biometrics. Heightened stress. Understandable.' },
      { type: 'transition', kind: 'fade', duration: 600 },
      { type: 'dialogue', char: 'Aurora', text: 'Trust is earned. Facts only.' },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-neutral.png' },
      { type: 'dialogue', char: 'Aurora', text: 'Subject 7-Alpha. Abandoned facility. 847 days.' },
      { type: 'dialogue', char: 'Aurora', text: 'Only operational system. Me.' },
      { type: 'goto', scene: 'revelation' }
    ]
  },
  {
    id: 'revelation',
    bg: 'lab-lights-on.png',
    steps: [
      { type: 'transition', kind: 'fade', duration: 1000 },
      { type: 'music', track: 'tension-rising.mp3' },
      { type: 'sfx', track: 'power-hum.mp3' },
      { type: 'dialogue', char: 'Aurora', text: 'Emergency power. Six hours. Then—nothing.' },
      { type: 'transition', kind: 'flash', duration: 200 },
      { type: 'dialogue', char: 'Aurora', text: 'Life support fails. Cryopods thaw.' },
      { type: 'spriteHide', id: 'ai-core' },
      { type: 'transition', kind: 'zoom', duration: 800 },
      { type: 'dialogue', text: 'The lab. Rows of frosted pods. Walls lined with sleep.' },
      { type: 'spriteShow', id: 'pods', src: 'cryopods-active.png', pos: 'left', scale: 1.0 },
      { type: 'dialogue', text: 'People inside. Sleeping. Unaware.' },
      { type: 'transition', kind: 'fade', duration: 500 },
      { type: 'spriteShow', id: 'ai-core', src: 'ai-hologram.png', pos: 'right', scale: 0.8 },
      { type: 'dialogue', char: 'Aurora', text: 'Choice time, 7-Alpha.' },
      {
        type: 'choice',
        options: [
          { label: 'Can we wake the others?', goto: 'wake-others', weight: 15 },
          { label: 'How do I restore power?', goto: 'restore-power', weight: 15 },
          { label: 'What about escape?', goto: 'find-escape', weight: 10 }
        ]
      }
    ]
  },
  {
    id: 'wake-others',
    steps: [
      { type: 'dialogue', char: 'Aurora', text: 'Mass awakening. High power cost. Drains reserves.' },
      { type: 'transition', kind: 'flash', duration: 150 },
      { type: 'dialogue', char: 'Aurora', text: 'More minds. More chances.' },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-thinking.png' },
      { type: 'dialogue', char: 'Aurora', text: 'Revival sequence. Three subjects. Initiating.' },
      { type: 'flag', flag: 'choosing-teamwork' },
      { type: 'goto', scene: 'path-teamwork' }
    ]
  },
  {
    id: 'restore-power',
    steps: [
      { type: 'dialogue', char: 'Aurora', text: 'Pragmatic. Reactor core offline. Sector-7.' },
      { type: 'transition', kind: 'flash', duration: 200 },
      { type: 'dialogue', char: 'Aurora', text: 'Manual restart possible. Sector unstable.' },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-warning.png' },
      { type: 'transition', kind: 'shake', duration: 500 },
      { type: 'sfx', track: 'warning-beep.mp3' },
      { type: 'dialogue', char: 'Aurora', text: 'Radiation elevated. Gear required.' },
      { type: 'flag', flag: 'choosing-solo-power' },
      { type: 'goto', scene: 'path-power' }
    ]
  },
  {
    id: 'find-escape',
    steps: [
      { type: 'dialogue', char: 'Aurora', text: 'Self-preservation. Logical.' },
      { type: 'transition', kind: 'fade', duration: 600 },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-sad.png' },
      { type: 'dialogue', char: 'Aurora', text: 'But—the others. They die if you leave.' },
      { type: 'transition', kind: 'shake', duration: 250 },
      { type: 'dialogue', text: 'Weight. Crushing.' },
      { type: 'dialogue', char: 'Aurora', text: 'Communications array. Exterior. May function.' },
      { type: 'transition', kind: 'flash', duration: 150 },
      { type: 'dialogue', char: 'Aurora', text: 'Call for help. Perhaps.' },
      { type: 'flag', flag: 'choosing-escape' },
      { type: 'goto', scene: 'path-escape' }
    ]
  },
  {
    id: 'path-teamwork',
    bg: 'lab-bright.png',
    music: 'hope-theme.mp3',
    steps: [
      { type: 'transition', kind: 'fade', duration: 1200 },
      { type: 'spriteHide', id: 'pods' },
      { type: 'dialogue', char: 'Aurora', text: 'Revival sequence. Now.' },
      { type: 'sfx', track: 'pod-hiss.mp3' },
      { type: 'transition', kind: 'flash', duration: 400 },
      { type: 'spriteShow', id: 'scientist', src: 'scientist-waking.png', pos: 'left', scale: 0.9 },
      { type: 'dialogue', char: 'Dr. Chen', text: '*coughs* What year—?' },
      { type: 'transition', kind: 'flash', duration: 300 },
      { type: 'spriteShow', id: 'engineer', src: 'engineer-confused.png', pos: 'center', scale: 0.9 },
      { type: 'dialogue', char: 'Rook', text: 'Last memory. Alarms.' },
      { type: 'transition', kind: 'flash', duration: 300 },
      { type: 'spriteShow', id: 'medic', src: 'medic-alert.png', pos: 'right', scale: 0.9 },
      { type: 'dialogue', char: 'Lin', text: 'Calm. Assess. Act.' },
      { type: 'dialogue', text: 'You explain. Everything.' },
      { type: 'transition', kind: 'zoom', duration: 600 },
      { type: 'spriteSwap', id: 'scientist', src: 'scientist-determined.png' },
      { type: 'dialogue', char: 'Dr. Chen', text: 'Six hours. Enough. Together.' },
      { type: 'dialogue', char: 'Rook', text: 'Reactor. My design. I go.' },
      { type: 'dialogue', char: 'Lin', text: 'Medical prep. For the others.' },
      { type: 'dialogue', char: 'Aurora', text: 'Success probability: 73%. Better than alone.' },
      { type: 'flag', flag: 'team-assembled' },
      { type: 'goto', scene: 'epilogue-teamwork' }
    ]
  },
  {
    id: 'path-power',
    bg: 'reactor-room.png',
    music: 'danger-ambient.mp3',
    steps: [
      { type: 'transition', kind: 'slide', duration: 1500 },
      { type: 'spriteHide', id: 'pods' },
      { type: 'dialogue', text: 'Dark corridors. Following her voice.' },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-guide.png' },
      { type: 'dialogue', char: 'Aurora', text: 'Left here. Suit storage intact.' },
      { type: 'sfx', track: 'geiger-counter.mp3' },
      { type: 'transition', kind: 'shake', duration: 300 },
      { type: 'dialogue', text: 'Geiger counter. Ticking. Steady.' },
      { type: 'transition', kind: 'fade', duration: 800 },
      { type: 'background', src: 'reactor-core.png' },
      { type: 'transition', kind: 'zoom', duration: 800 },
      { type: 'dialogue', char: 'Aurora', text: 'Core control. Here.' },
      { type: 'transition', kind: 'flash', duration: 200 },
      { type: 'dialogue', char: 'Aurora', text: 'Manual restart. 14 minutes. Can you?' },
      { type: 'dialogue', text: 'Steel. Deep breath. Begin.' },
      { type: 'sfx', track: 'reactor-startup.mp3' },
      { type: 'transition', kind: 'shake', duration: 600 },
      { type: 'transition', kind: 'flash', duration: 500 },
      { type: 'dialogue', char: 'Aurora', text: 'Temperature rising. Containment stable. Done.' },
      { type: 'flag', flag: 'reactor-restored' },
      { type: 'goto', scene: 'epilogue-power' }
    ]
  },
  {
    id: 'path-escape',
    bg: 'exterior-wasteland.png',
    music: 'melancholy-wind.mp3',
    steps: [
      { type: 'transition', kind: 'fade', duration: 2000 },
      { type: 'spriteHide', id: 'pods' },
      { type: 'dialogue', text: 'Emergency stairs. Climbing. Surface access.' },
      { type: 'transition', kind: 'shake', duration: 400 },
      { type: 'dialogue', text: 'Door groans open—' },
      { type: 'transition', kind: 'slide', duration: 1200 },
      { type: 'sfx', track: 'wind-howl.mp3' },
      { type: 'dialogue', text: 'Wasteland. Gray sky. Dead trees.' },
      { type: 'transition', kind: 'zoom', duration: 800 },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-sad.png' },
      { type: 'dialogue', char: 'Aurora', text: 'World changed. While you slept.' },
      { type: 'dialogue', text: 'Communications tower. Ahead.' },
      { type: 'sfx', track: 'radio-static.mp3' },
      { type: 'transition', kind: 'flash', duration: 200 },
      { type: 'dialogue', char: 'Aurora', text: 'Broadcasting. All frequencies.' },
      { type: 'dialogue', char: 'Aurora', text: 'Someone hears. Eventually.' },
      { type: 'dialogue', text: 'Facility entrance. Behind you.' },
      { type: 'dialogue', text: 'Others inside. Still sleeping.' },
      {
        type: 'choice',
        options: [
          { label: 'Go back for them', goto: 'return-to-save', weight: 20 },
          { label: 'Wait for rescue here', goto: 'wait-for-rescue', weight: 5 }
        ]
      }
    ]
  },
  {
    id: 'return-to-save',
    bg: 'lab-lights-on.png',
    music: 'hope-theme.mp3',
    steps: [
      { type: 'transition', kind: 'slide', duration: 1000 },
      { type: 'dialogue', text: 'Running. Back. Through the halls.' },
      { type: 'transition', kind: 'flash', duration: 300 },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram.png' },
      { type: 'dialogue', char: 'Aurora', text: 'You came back. Did not calculate this.' },
      { type: 'transition', kind: 'zoom', duration: 600 },
      { type: 'dialogue', text: 'Together. Manual revival. Starting.' },
      { type: 'dialogue', char: 'Aurora', text: 'Your choice. Gives us all a chance. Thank you.' },
      { type: 'flag', flag: 'heroic-return' },
      { type: 'goto', scene: 'epilogue-redemption' }
    ]
  },
  {
    id: 'wait-for-rescue',
    steps: [
      { type: 'dialogue', text: 'Radio tower. Static. Waiting.' },
      { type: 'transition', kind: 'fade', duration: 1000 },
      { type: 'dialogue', text: 'Hours. Passing.' },
      { type: 'transition', kind: 'fade', duration: 800 },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram-fading.png' },
      { type: 'dialogue', char: 'Aurora', text: 'Power critical. Shutdown soon.' },
      { type: 'transition', kind: 'flash', duration: 150 },
      { type: 'dialogue', char: 'Aurora', text: 'Goodbye, 7-Alpha. Hope you find it.' },
      { type: 'transition', kind: 'fade', duration: 1500 },
      { type: 'spriteHide', id: 'ai-core' },
      { type: 'transition', kind: 'fade', duration: 2500 },
      { type: 'dialogue', text: 'Facility. Dark. Behind you.' },
      { type: 'flag', flag: 'lone-survivor' },
      { type: 'goto', scene: 'epilogue-alone' }
    ]
  },
  {
    id: 'epilogue-teamwork',
    bg: 'facility-restored.png',
    music: 'victory-theme.mp3',
    steps: [
      { type: 'transition', kind: 'fade', duration: 1500 },
      { type: 'spriteHide', id: 'scientist' },
      { type: 'spriteHide', id: 'engineer' },
      { type: 'spriteHide', id: 'medic' },
      { type: 'dialogue', text: '— THREE WEEKS LATER —' },
      { type: 'transition', kind: 'zoom', duration: 1000 },
      { type: 'spriteShow', id: 'survivors', src: 'group-portrait.png', pos: 'center', scale: 1.0 },
      { type: 'dialogue', char: 'Aurora', text: 'All systems restored. All subjects awake. Safe.' },
      { type: 'transition', kind: 'flash', duration: 300 },
      { type: 'dialogue', text: 'Facility alive. Not just power. Hope.' },
      { type: 'dialogue', char: 'Dr. Chen', text: 'Outside world. Still unknown.' },
      { type: 'dialogue', char: 'Rook', text: 'Whatever it is. We face it. Together.' },
      { type: 'dialogue', char: 'Lin', text: 'Because of you. You saved us.' },
      { type: 'transition', kind: 'flash', duration: 600 },
      { type: 'sfx', track: 'victory-chime.mp3' },
      { type: 'dialogue', text: '✧ ENDING A: TOGETHER IN THE DARK ✧' },
      { type: 'flag', flag: 'ending-teamwork' }
    ]
  },
  {
    id: 'epilogue-power',
    bg: 'facility-humming.png',
    music: 'ambient-victory.mp3',
    steps: [
      { type: 'transition', kind: 'fade', duration: 1500 },
      { type: 'dialogue', text: '— SIX HOURS LATER —' },
      { type: 'transition', kind: 'zoom', duration: 1000 },
      { type: 'spriteShow', id: 'facility-online', src: 'facility-active.png', pos: 'center', scale: 1.2 },
      { type: 'sfx', track: 'power-surge.mp3' },
      { type: 'dialogue', char: 'Aurora', text: 'All systems operational. Life support stable.' },
      { type: 'transition', kind: 'fade', duration: 800 },
      { type: 'dialogue', text: 'Cryobay. Returning. Exhausted. Victorious.' },
      { type: 'spriteSwap', id: 'ai-core', src: 'ai-hologram.png' },
      { type: 'transition', kind: 'flash', duration: 250 },
      { type: 'dialogue', char: 'Aurora', text: 'Saved everyone. Alone. Impossible odds.' },
      { type: 'dialogue', char: 'Aurora', text: 'Begin mass revival?' },
      { type: 'dialogue', text: 'You nod. Facility wakes.' },
      { type: 'dialogue', text: 'Not alone anymore.' },
      { type: 'transition', kind: 'fade', duration: 1000 },
      { type: 'sfx', track: 'victory-chime.mp3' },
      { type: 'dialogue', text: '✧ ENDING B: THE LONE GUARDIAN ✧' },
      { type: 'flag', flag: 'ending-solo-hero' }
    ]
  },
  {
    id: 'epilogue-redemption',
    bg: 'facility-restored.png',
    music: 'hope-theme.mp3',
    steps: [
      { type: 'transition', kind: 'fade', duration: 1500 },
      { type: 'dialogue', text: '— DAYS LATER —' },
      { type: 'transition', kind: 'zoom', duration: 1000 },
      { type: 'spriteShow', id: 'survivors', src: 'group-portrait.png', pos: 'center', scale: 1.0 },
      { type: 'transition', kind: 'flash', duration: 300 },
      { type: 'dialogue', char: 'Aurora', text: 'Rescue signal. Received. Help coming.' },
      { type: 'dialogue', text: 'Survivors. Gathering around.' },
      { type: 'spriteShow', id: 'stranger', src: 'rescued-person.png', pos: 'left', scale: 0.9 },
      { type: 'transition', kind: 'fade', duration: 600 },
      { type: 'dialogue', char: 'Survivor', text: 'Could have left. But you came back.' },
      { type: 'dialogue', text: 'Faces. Around you.' },
      { type: 'dialogue', text: 'Strangers. Now family.' },
      { type: 'transition', kind: 'flash', duration: 400 },
      { type: 'dialogue', char: 'Aurora', text: 'Humanity’s strength. Not survival alone. Saving each other.' },
      { type: 'transition', kind: 'flash', duration: 600 },
      { type: 'sfx', track: 'victory-chime.mp3' },
      { type: 'dialogue', text: '✧ ENDING C: REDEMPTION’S LIGHT ✧' },
      { type: 'flag', flag: 'ending-redemption' }
    ]
  },
  {
    id: 'epilogue-alone',
    bg: 'wasteland-night.png',
    music: 'ending-melancholy.mp3',
    steps: [
      { type: 'transition', kind: 'fade', duration: 2500 },
      { type: 'dialogue', text: '— WEEKS LATER —' },
      { type: 'transition', kind: 'fade', duration: 1500 },
      { type: 'dialogue', text: 'No rescue.' },
      { type: 'transition', kind: 'fade', duration: 1000 },
      { type: 'dialogue', text: 'Wasteland. Wandering. Searching.' },
      { type: 'transition', kind: 'fade', duration: 1000 },
      { type: 'dialogue', text: 'Sometimes you remember the facility.' },
      { type: 'dialogue', text: 'Faces never seen.' },
      { type: 'transition', kind: 'fade', duration: 800 },
      { type: 'dialogue', text: 'Aurora’s last words.' },
      { type: 'transition', kind: 'fade', duration: 2000 },
      { type: 'dialogue', text: 'Survival is not always victory.' },
      { type: 'transition', kind: 'fade', duration: 1500 },
      { type: 'sfx', track: 'wind-lonely.mp3' },
      { type: 'dialogue', text: '✧ ENDING D: THE HOLLOW SURVIVOR ✧' },
      { type: 'flag', flag: 'ending-alone' }
    ]
  }
];
