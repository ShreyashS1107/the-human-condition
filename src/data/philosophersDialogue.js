// Socratic & Philosophical Dialogue System Data
// All dialogue questions are original thematic inquiries designed to expose cognitive contradictions.
// Verified quotations are included only for preserved historical texts.

export const PHILOSOPHERS_DIALOGUE_DATA = [
  {
    id: 'socrates',
    name: 'Socrates',
    title: 'The Questioner of Athens',
    era: 'c. 470 – 399 BCE',
    theme: 'The Examination of Certainty',
    themeColor: '#d4af37',
    ambientColor: '#e8dec8',
    lightIntensity: 2.2,
    position: [-6.0, 0, -2.5],
    soundTone: { freq: 220.0, filter: 320 },
    environmentType: 'classical_stone',
    summary: 'Sparse stone colonnades, calm warmth, and relentless examination of unexamined axioms.',
    dialogue: {
      initialQuestion: 'Do you believe that you know what kind of person you are?',
      nodes: {
        root: {
          question: 'Do you believe that you know what kind of person you are?',
          options: [
            { text: 'Yes, through reflection and memory I understand myself.', nextNode: 'claim_knowledge' },
            { text: 'No, self-knowledge is an ongoing ambiguity.', nextNode: 'claim_ignorance' },
            { text: 'I am whatever my actions produce in each moment.', nextNode: 'claim_action' },
          ],
        },
        claim_knowledge: {
          question: 'If the person you believe yourself to be changes under unforeseen tragedy tomorrow, which version was the real you?',
          options: [
            { text: 'The earlier one, before external distortion.', nextNode: 'contradiction_fragile' },
            { text: 'The later one, tested by genuine pressure.', nextNode: 'contradiction_illusion' },
            { text: 'Both, since identity is not a fixed monument.', nextNode: 'contradiction_multiplicity' },
          ],
        },
        claim_ignorance: {
          question: 'If you confess you do not know yourself, on what authority do you make life-altering choices for that stranger?',
          options: [
            { text: 'On trust that instinct guides me rightly.', nextNode: 'contradiction_blind_faith' },
            { text: 'On necessity; inaction is also a choice.', nextNode: 'contradiction_necessity' },
          ],
        },
        claim_action: {
          question: 'If your actions define you, who was the one deliberating before the action occurred?',
          options: [
            { text: 'A collection of habits formed by upbringing.', nextNode: 'contradiction_automaton' },
            { text: 'A conscious will exercising genuine freedom.', nextNode: 'contradiction_unproven_will' },
          ],
        },
        contradiction_fragile: {
          question: 'So your true self is only true so long as the world leaves it untouched? Is a blade only sharp until it meets wood?',
          options: [
            { text: 'Perhaps what I called certainty was merely comfort.', nextNode: 'conclusion' },
          ],
        },
        contradiction_illusion: {
          question: 'Then the self you believed you knew today is merely an unverified draft waiting to be rewritten by circumstance?',
          options: [
            { text: 'Then I only know who I was, never who I am.', nextNode: 'conclusion' },
          ],
        },
        contradiction_multiplicity: {
          question: 'If the self is a multitude, who speaks when you say the word "I"?',
          options: [
            { text: 'The voice that happens to hold the microphone right now.', nextNode: 'conclusion' },
          ],
        },
        contradiction_blind_faith: {
          question: 'You surrender your autonomy to an instinct whose origin you cannot examine. Is that freedom, or obedience?',
          options: [
            { text: 'Perhaps it is obedience masquerading as will.', nextNode: 'conclusion' },
          ],
        },
        contradiction_necessity: {
          question: 'Then you do not choose out of freedom, but because the walls of time leave you no other exit.',
          options: [
            { text: 'The exit was always narrow.', nextNode: 'conclusion' },
          ],
        },
        contradiction_automaton: {
          question: 'If you are habits, you are a clock wound up by parents and ancestors. Why take pride in the hour you strike?',
          options: [
            { text: 'I have mistaken the ticking for my own voice.', nextNode: 'conclusion' },
          ],
        },
        contradiction_unproven_will: {
          question: 'If the will is uncaused, it is random; if caused, it is determined. Where in that dilemma does your self reside?',
          options: [
            { text: 'In the mystery between the two.', nextNode: 'conclusion' },
          ],
        },
        conclusion: {
          question: 'We have not arrived at a dogma, only stripped away the illusion that we possessed one. The examination has only begun.',
          isEnd: true,
        },
      },
    },
    book: {
      id: 'plato_dialogues',
      title: "Plato's Early Dialogues",
      author: 'Preserved by Plato (depicting Socratic Inquests)',
      year: 'c. 385 BCE',
      subtext: 'The Apology, Euthyphro, and Crito',
      summary: 'Works recording the relentless Socratic cross-examination of virtue, piety, and the illusion of knowledge in ancient Athens.',
      verifiedQuote: 'The unexamined life is not worth living.',
    },
  },
  {
    id: 'nietzsche',
    name: 'Friedrich Nietzsche',
    title: 'The Solitary of Sils Maria',
    era: '1844 – 1900',
    theme: 'The Will to Power & Eternal Return',
    themeColor: '#b83b32',
    ambientColor: '#4a1515',
    lightIntensity: 3.0,
    position: [-3.0, 0, -3.8],
    soundTone: { freq: 164.8, filter: 480 },
    environmentType: 'fractured_abyss',
    summary: 'Distorted geometric fragments, stark shadows, and the violent shattering of inherited morality.',
    dialogue: {
      initialQuestion: 'If an entity told you that you must live this exact life again and again for eternity, would you curse it or fall to your knees?',
      nodes: {
        root: {
          question: 'If an entity told you that you must live this exact life again and again for eternity, would you curse it or fall to your knees?',
          options: [
            { text: 'I would curse it; suffering is not worth infinite repetition.', nextNode: 'reject_recurrence' },
            { text: 'I would embrace it; my joys and struggles justify the whole.', nextNode: 'embrace_recurrence' },
            { text: 'I would refuse to answer an impossible hypothetical.', nextNode: 'evade_recurrence' },
          ],
        },
        reject_recurrence: {
          question: 'Then you admit your life is currently an unpaid debt. What are you waiting for to make it worthy of eternity?',
          options: [
            { text: 'A future where my aims are finally achieved.', nextNode: 'contradiction_postponed' },
            { text: 'Some lives simply contain unredeemable cruelty.', nextNode: 'contradiction_pessimism' },
          ],
        },
        embrace_recurrence: {
          question: 'You claim to love your life, yet how much of it do you spend numbing your consciousness with trivial distractions?',
          options: [
            { text: 'Distraction is merely rest between battles.', nextNode: 'contradiction_rest' },
            { text: 'Perhaps I fear looking directly at the weight of my own days.', nextNode: 'contradiction_honest_fear' },
          ],
        },
        evade_recurrence: {
          question: 'You evade the question because you sense the verdict it would pass on the way you spent this morning.',
          options: [
            { text: 'I do not need metaphysical tests to live decently.', nextNode: 'contradiction_decency' },
            { text: 'You are right; the thought burns.', nextNode: 'conclusion' },
          ],
        },
        contradiction_postponed: {
          question: 'You live in an eternal waiting room! You sacrifice the only guaranteed reality for a tomorrow that never arrives.',
          options: [
            { text: 'I have treated my present as a disposable rehearsal.', nextNode: 'conclusion' },
          ],
        },
        contradiction_pessimism: {
          question: 'If you judge existence by the absence of pain, you have made a corpse your ideal of perfection.',
          options: [
            { text: 'Pain gave shape to the few victories I remember.', nextNode: 'conclusion' },
          ],
        },
        contradiction_rest: {
          question: 'A battle? Or an elaborate ritual to avoid deciding who you must become?',
          options: [
            { text: 'I have feared my own potential more than failure.', nextNode: 'conclusion' },
          ],
        },
        contradiction_honest_fear: {
          question: 'Now you begin to speak with blood rather than borrowed ink. Amor Fati is not comfort; it is fire.',
          options: [
            { text: 'Let the fire burn what is weak.', nextNode: 'conclusion' },
          ],
        },
        contradiction_decency: {
          question: '"Decency" is the sheep\'s word for having teeth too dull to bite.',
          options: [
            { text: 'Perhaps morality was merely a shield for my cowardice.', nextNode: 'conclusion' },
          ],
        },
        conclusion: {
          question: 'Do not seek disciples here. Go back and carve an existence that you would dare to relive ten thousand times.',
          isEnd: true,
        },
      },
    },
    book: {
      id: 'thus_spoke_zarathustra',
      title: 'Thus Spoke Zarathustra',
      author: 'Friedrich Nietzsche',
      year: '1883',
      subtext: 'A Book for All and None',
      summary: 'A philosophical masterpiece proclaiming the death of old gods, the Overman, and the supreme affirmation of Eternal Recurrence.',
      verifiedQuote: 'One must still have chaos in oneself to be able to give birth to a dancing star.',
    },
  },
  {
    id: 'dostoevsky',
    name: 'Fyodor Dostoevsky',
    title: 'The Voice from the Underground',
    era: '1821 – 1881',
    theme: 'The Irrational Soul & Moral Torment',
    themeColor: '#7a5a3a',
    ambientColor: '#1c1512',
    lightIntensity: 1.8,
    position: [0, 0, -4.5],
    soundTone: { freq: 110.0, filter: 200 },
    environmentType: 'narrow_shadows',
    summary: 'Claustrophobic heavy timber, flickering candle gutters, and the deep paradox of human spite.',
    dialogue: {
      initialQuestion: 'If science proved that every choice you make is mathematically calculable like 2 × 2 = 4, would you still wish to be human?',
      nodes: {
        root: {
          question: 'If science proved that every choice you make is mathematically calculable like 2 × 2 = 4, would you still wish to be human?',
          options: [
            { text: 'Yes, because truth is preferable to an illusion of mystery.', nextNode: 'prefer_table' },
            { text: 'No, I would smash the table to prove I am not a piano key.', nextNode: 'smash_table' },
            { text: 'I would find peace in knowing I am not to blame.', nextNode: 'peace_in_fate' },
          ],
        },
        prefer_table: {
          question: 'You say you prefer the formula, yet why do you secretly take pleasure in moments of self-sabotage and spite?',
          options: [
            { text: 'Those are flaws I strive to overcome.', nextNode: 'contradiction_flaws' },
            { text: 'Perhaps I destroy things solely to feel my own agency.', nextNode: 'contradiction_spite' },
          ],
        },
        smash_table: {
          question: 'And what if even your desire to smash the table was already accounted for in the equation?',
          options: [
            { text: 'Then I would go mad voluntarily as a final rebellion.', nextNode: 'contradiction_madness' },
            { text: 'Then despair is the only rational condition.', nextNode: 'contradiction_despair' },
          ],
        },
        peace_in_fate: {
          question: 'If you bear no blame, then you also bear no love, no nobility, and no soul. Are you content as an inanimate stone?',
          options: [
            { text: 'Guilt is too heavy a price to pay for dignity.', nextNode: 'contradiction_guilt' },
            { text: 'I cannot accept being an object, yet I dread responsibility.', nextNode: 'conclusion' },
          ],
        },
        contradiction_flaws: {
          question: 'You call your deepest human yearnings "flaws" to make yourself fit into a spreadsheet. What a tragic bargain!',
          options: [
            { text: 'I have traded my irrational soul for artificial order.', nextNode: 'conclusion' },
          ],
        },
        contradiction_spite: {
          question: 'Precisely! Man will purposely desire what is harmful just to prove his freedom from logic.',
          options: [
            { text: 'We are creatures of spite and divine longing combined.', nextNode: 'conclusion' },
          ],
        },
        contradiction_madness: {
          question: 'Even in madness, man clings to the agony of his suffering rather than surrender his will to a system.',
          options: [
            { text: 'Suffering is the sole origin of consciousness.', nextNode: 'conclusion' },
          ],
        },
        contradiction_despair: {
          question: 'Despair is the underground cellar where man finally confronts what he has hidden from society.',
          options: [
            { text: 'I have heard the echo from the underground.', nextNode: 'conclusion' },
          ],
        },
        contradiction_guilt: {
          question: 'Without guilt, there is no redemption. You would kill your heart to cure a headache.',
          options: [
            { text: 'I must bear the weight of my own contradictions.', nextNode: 'conclusion' },
          ],
        },
        conclusion: {
          question: 'You cannot calculate the human heart on an abacus. Go, and do not pretend you are a machine.',
          isEnd: true,
        },
      },
    },
    book: {
      id: 'notes_from_underground',
      title: 'Notes from Underground',
      author: 'Fyodor Dostoevsky',
      year: '1864',
      subtext: 'A Monologue from the Depths',
      summary: 'A searing critique of utopian rationalism and an exploration of the irrational, spiteful, and profound depth of the isolated human psyche.',
      verifiedQuote: 'I say let the world go to hell, but I should always have my tea.',
    },
  },
  {
    id: 'camus',
    name: 'Albert Camus',
    title: 'The Witness of the Absurd',
    era: '1913 – 1960',
    theme: 'The Absurd & Lucid Rebellion',
    themeColor: '#78909c',
    ambientColor: '#10171d',
    lightIntensity: 2.4,
    position: [3.0, 0, -3.8],
    soundTone: { freq: 146.8, filter: 260 },
    environmentType: 'silent_monolith',
    summary: 'Pale limestone monoliths, stark Mediterranean daylight filtered through dark clouds, and unyielding lucidity.',
    dialogue: {
      initialQuestion: 'When you realize the universe does not care about your hopes or sorrows, how do you continue your morning routine?',
      nodes: {
        root: {
          question: 'When you realize the universe does not care about your hopes or sorrows, how do you continue your morning routine?',
          options: [
            { text: 'I create my own subjective meaning through art and connection.', nextNode: 'make_meaning' },
            { text: 'I distract myself so I do not have to think about it.', nextNode: 'habit_distraction' },
            { text: 'I live in conscious defiance, enjoying existence without hope.', nextNode: 'rebel_defiance' },
          ],
        },
        make_meaning: {
          question: 'If you know your created meaning will vanish completely when the sun burns out, is it meaning, or a comforting bedtime story?',
          options: [
            { text: 'It matters to me now; eternity is irrelevant.', nextNode: 'contradiction_now' },
            { text: 'Perhaps it is an illusion, but one I require to live.', nextNode: 'contradiction_myth' },
          ],
        },
        habit_distraction: {
          question: 'Rising, streetcar, four hours in the office, meal, streetcar, four hours at work... how long before the curtain falls?',
          options: [
            { text: 'Until one day the "why" arises and everything begins.', nextNode: 'conclusion' },
            { text: 'Habit is safer than the abyss.', nextNode: 'contradiction_safety' },
          ],
        },
        rebel_defiance: {
          question: 'You push the boulder up the mountain only to watch it roll down. Does Sisyphus ever weep?',
          options: [
            { text: 'He weeps, but his return to the stone is his triumph.', nextNode: 'contradiction_sisyphus' },
            { text: 'He is free because he expects no reward.', nextNode: 'conclusion' },
          ],
        },
        contradiction_now: {
          question: 'To live fully in the present without demanding eternal guarantees—that is the very definition of the absurd hero.',
          options: [
            { text: 'I accept the stone without demanding a cathedral.', nextNode: 'conclusion' },
          ],
        },
        contradiction_myth: {
          question: 'Why need an illusion? Is the raw salt of the ocean and the warmth of the sun not enough on their own?',
          options: [
            { text: 'I have demanded too much from a silent world.', nextNode: 'conclusion' },
          ],
        },
        contradiction_safety: {
          question: 'Safety is the quietest form of suicide. You have died without having the courage to stop breathing.',
          options: [
            { text: 'I must awaken from the routine.', nextNode: 'conclusion' },
          ],
        },
        contradiction_sisyphus: {
          question: 'One must imagine Sisyphus happy. The struggle itself toward the heights is enough to fill a man\'s heart.',
          options: [
            { text: 'I return to my stone with open eyes.', nextNode: 'conclusion' },
          ],
        },
        conclusion: {
          question: 'There is no fate that cannot be surmounted by scorn and lucid presence.',
          isEnd: true,
        },
      },
    },
    book: {
      id: 'the_myth_of_sisyphus',
      title: 'The Myth of Sisyphus',
      author: 'Albert Camus',
      year: '1942',
      subtext: 'An Essay on the Absurd',
      summary: 'A foundational philosophical work confronting the problem of suicide, the silence of the universe, and heroic lucid revolt.',
      verifiedQuote: 'There is only one really serious philosophical problem, and that is suicide.',
    },
  },
  {
    id: 'woolf',
    name: 'Virginia Woolf',
    title: 'The Architect of the Stream',
    era: '1882 – 1941',
    theme: 'Time, Memory & Shifting Consciousness',
    themeColor: '#4f728c',
    ambientColor: '#121f29',
    lightIntensity: 2.6,
    position: [6.0, 0, -2.5],
    soundTone: { freq: 261.6, filter: 380 },
    environmentType: 'fluid_stream',
    summary: 'Water-like refraction, translucent drifting memoirs, shifting partitions of memory, and rhythmic time echoes.',
    dialogue: {
      initialQuestion: 'Are you a single continuous person walking through time, or a series of ephemeral rooms you leave behind forever?',
      nodes: {
        root: {
          question: 'Are you a single continuous person walking through time, or a series of ephemeral rooms you leave behind forever?',
          options: [
            { text: 'A continuous person tied together by memories.', nextNode: 'memory_thread' },
            { text: 'A series of momentary rooms; the past self is dead.', nextNode: 'rooms_ephemeral' },
            { text: 'I am not an island, but woven from everyone I have touched.', nextNode: 'woven_selves' },
          ],
        },
        memory_thread: {
          question: 'If memories tie you together, why do you remember the trivial slant of light in an old garden, but forget the vows you swore five years ago?',
          options: [
            { text: 'Because feeling is more durable than intention.', nextNode: 'contradiction_feeling' },
            { text: 'Memory is an artist, not an honest archivist.', nextNode: 'contradiction_archivist' },
          ],
        },
        rooms_ephemeral: {
          question: 'If the past self is dead, who is mourning it right now inside your chest?',
          options: [
            { text: 'An echo that hasn’t finished bouncing against the walls.', nextNode: 'contradiction_echo' },
            { text: 'The present self grieving its own inevitable disappearance.', nextNode: 'conclusion' },
          ],
        },
        woven_selves: {
          question: 'If you are woven from others, where does your own voice begin and the world\'s chatter end?',
          options: [
            { text: 'In the solitary silence between two thoughts.', nextNode: 'conclusion' },
            { text: 'Perhaps there is no pure boundary at all.', nextNode: 'contradiction_boundary' },
          ],
        },
        contradiction_feeling: {
          question: 'Then your identity is governed by fleeting impressions rather than reasoned character.',
          options: [
            { text: 'Life is a luminous halo, a semi-transparent envelope.', nextNode: 'conclusion' },
          ],
        },
        contradiction_archivist: {
          question: 'Then the person you believe you are is a fiction edited by nostalgia and self-preservation.',
          options: [
            { text: 'We are our own most intricate novels.', nextNode: 'conclusion' },
          ],
        },
        contradiction_echo: {
          question: 'Let the echo fade. Look at the lighthouse across the bay before the fog returns.',
          options: [
            { text: 'I see the light turning in the dark.', nextNode: 'conclusion' },
          ],
        },
        contradiction_boundary: {
          question: 'To dissolve the boundary is to become the wave rather than the swimmer.',
          options: [
            { text: 'I am both the wave and the shore.', nextNode: 'conclusion' },
          ],
        },
        conclusion: {
          question: 'Moments of being are all we possess before Big Ben strikes the irrevocable hour.',
          isEnd: true,
        },
      },
    },
    book: {
      id: 'to_the_lighthouse',
      title: 'To the Lighthouse',
      author: 'Virginia Woolf',
      year: '1927',
      subtext: 'A Symphony of Memory and Time',
      summary: 'A luminous modernist masterpiece exploring the passage of time, the grief of loss, the artistic struggle, and moments of transcendent being.',
      verifiedQuote: 'What is the meaning of life? That was all—a simple question; one that tended to close in on one with years.',
    },
  },
];
