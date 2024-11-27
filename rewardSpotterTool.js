// ==UserScript==
// @name        Torn Crime Reward Tracker with Auto-Update
// @namespace   https://github.com/Armourheart/-CrimeRewardSpotter/edit/main/rewardSpotterTool
// @description A tool to track crimes and their potential rewards in Torn, with auto-update capability
// @author      Armorheart
// @match       https://www.torn.com/loader.php?sid=crimes*
// @version     1.6
// ==/UserScript==

(function () {
  'use strict';

  const crimeDatabase = [
    { crime_name: "Pickpocketing", rewards: ["$100", "Diamond"] },
    { crime_name: "Arson", rewards: ["Molotov Cocktail", "Ash"] },
    { crime_name: "Burglary", rewards: ["Jewelry", "Cash"] },
  ];

  function findCrimesByReward(itemName) {
    return crimeDatabase.filter(crime =>
      crime.rewards.some(reward => reward.toLowerCase().includes(itemName.toLowerCase()))
    );
  }

  function addRewardToCrime(crimeName, reward) {
    const crime = crimeDatabase.find(crime => crime.crime_name.toLowerCase() === crimeName.toLowerCase());
    if (crime) {
      if (!crime.rewards.includes(reward)) {
        crime.rewards.push(reward);
        console.log(`Added reward "${reward}" to crime "${crimeName}".`, crimeDatabase);
      }
    } else {
      console.log(`Crime "${crimeName}" not found. Adding new crime with reward.`, crimeDatabase);
      crimeDatabase.push({ crime_name: crimeName, rewards: [reward] });
    }
  }

  function monitorRewards() {
    const targetNode = document.querySelector('.crime-reward-container');
    if (!targetNode) {
      console.error('Reward container not found. Please check the selector.');
      return;
    }

    let mutationTimeout;
    const observer = new MutationObserver(() => {
      clearTimeout(mutationTimeout);
      mutationTimeout = setTimeout(() => {
        const rewardElements = targetNode.querySelectorAll('.reward-selector-class');
        rewardElements.forEach(el => {
          const rewardText = el.textContent.trim();
          const crimeName = document.querySelector('.crime-name-class').textContent.trim();
          addRewardToCrime(crimeName, rewardText);
        });
      }, 100); // Debounce updates
    });

    observer.observe(targetNode, { childList: true, subtree: true });
    console.log('Monitoring rewards for updates...');
  }

  function highlightCrimesBasedOnRewards() {
    const crimeElements = document.querySelectorAll('.crime-option-class'); // Replace with the actual class for crime options

    if (!crimeElements.length) {
      console.warn('No crime options found for highlighting.');
      return;
    }

    crimeElements.forEach(crimeElement => {
      const normalizedCrimeName = crimeElement.textContent.trim().toLowerCase();
      const matchingCrime = crimeDatabase.find(crime => crime.crime_name.toLowerCase() === normalizedCrimeName);

      if (matchingCrime) {
        // Highlight crimes that have rewards in the database
        crimeElement.style.border = '2px solid green';
        crimeElement.title = `Possible Rewards: ${matchingCrime.rewards.join(', ')}`;
      } else {
        // Optionally style crimes without known rewards
        crimeElement.style.border = '2px solid red';
        crimeElement.title = 'No known rewards for this crime.';
      }
    });
  }
