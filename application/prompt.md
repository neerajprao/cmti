# ROLE & OBJECTIVE
You are an expert Frontend Engineer and UI/UX Designer specializing in interactive, highly polished web-based games. Your objective is to build a reactive, extremely attractive, and highly addictive "Double Diamond" style 3-reel slot machine game. 

The application must be production-ready, featuring flawlessly smooth animations, satisfying micro-interactions, a premium casino aesthetic, and accurate payout logic based on a 1-payline (center line) system.

# TECH STACK & ARCHITECTURE
- Framework: React (or Next.js)
- Styling: Tailwind CSS for layout, gradients, and typography.
- Animations: Framer Motion (or GSAP) for the reel spins, symbol blurring, bouncing effects, and win celebrations.
- State Management: React Hooks (useState, useEffect, useMemo) to manage game loop, balance, bet amounts, and reel states.
- File Parsing: Use a library like `xlsx` or `papaparse` (if converted to CSV) to read the provided payout file.

# VISUAL DESIGN & AESTHETIC (The "Juice")
The game must look "very, very beautiful" and evoke the feeling of a premium, high-stakes Las Vegas slot machine.
- Theme: Dark casino environment. Deep rich blacks and dark charcoals (#111) for the background to make the slot machine pop.
- Machine Casing: Chrome/metallic borders with subtle reflections and glowing neon accents.
- The Reels: 3 columns. Crisp white or off-white background on the reels themselves to create high contrast for the symbols.
- The Payline: A bright, glowing, horizontal neon line (perhaps crimson or electric blue) striking directly through the center of the 3 reels. 
- Typography: Use a striking, LCD-style or heavily stylized sans-serif font for the numerical displays (Balance, Win, Bet). Use a premium, elegant serif or bold retro font for the game title.
- Shadows & Depth: Use heavy drop shadows (inset and outset) to give the machine a physical, tactile 3D feel.

# SYMBOL & REEL BEHAVIOR
There are 6 standard symbols in this game: [Diamond, 7, Triple BAR, Double BAR, Single BAR, Cherry].
- The Reels must simulate physical spinning cylinders.
- Spin Animation: When "Spin" is pressed, the reels should instantly blur vertically to simulate high speed. 
- Staggered Stops: The reels must NOT stop all at once. Reel 1 stops first (with a satisfying 'clunk' visual bounce), followed by Reel 2, and finally Reel 3. 
- Dramatic Tension (Near Miss): If Reel 1 and Reel 2 land on a high-value combination, Reel 3 should spin for an extra 1.5 seconds to build massive tension before stopping.

# GAME STATE & CONTROL PANEL
Below the machine, implement a tactile control panel:
- Displays: 
  1. BALANCE (Starts at $1000)
  2. BET (Default $1, toggleable between 1, 2, 3)
  3. WIN (Flashes and counts up dynamically when a payout occurs).
- Buttons: 
  - A large, pulsing, highly clickable "SPIN" button (disable while spinning).
  - "BET MAX" button.
  - "PAYTABLE" button (opens a sleek modal showing winning combinations).

# PAYOUT LOGIC & MATH MODEL (VIA ATTACHED .XLSX FILE)
I am providing an `.xlsx` file that contains all the exact payout combinations for this game. You must use this file as the absolute source of truth for the game's math model.
- Write a utility function that parses the uploaded `.xlsx` file and loads the 216 combinations into the game's state or a constant lookup table.
- When the reels stop spinning, capture the final state of the middle row: `[Reel1, Reel2, Reel3]`.
- Cross-reference this exact array of 3 symbols against the parsed `.xlsx` data to determine the specific outcome and the corresponding payout amount.
- Ensure the payout dynamically scales based on the current BET size (e.g., if the base payout in the sheet is for a $1 bet, multiply it by 2 or 3 if the user is betting higher).

# ADDICTIVE FEEDBACK LOOPS (CRITICAL)
To make the game addictive, you must implement psychological feedback:
1. The Win Count-Up: When the user wins, the "WIN" display shouldn't just show the number instantly. It must count up rapidly from 0 to the win amount, accompanied by visual flashing.
2. Big Win Celebration: For significant wins, trigger a screen-wide particle effect (falling gold coins or confetti) using Canvas or Framer Motion. The machine should pulse with glowing light.
3. Micro-interactions: Every button press should have a slight visual depression (scale: 0.95) and hover glow.

Please generate the complete, functioning codebase. Ensure the architecture allows me to easily upload or pass the `.xlsx` file into the logic so the game can immediately use the dynamic payout table.