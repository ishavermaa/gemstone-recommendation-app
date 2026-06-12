const zodiacPlanetMap = {
  Aries: 'Mars',
  Taurus: 'Venus',
  Gemini: 'Mercury',
  Cancer: 'Moon',
  Leo: 'Sun',
  Virgo: 'Mercury',
  Libra: 'Venus',
  Scorpio: 'Mars',
  Sagittarius: 'Jupiter',
  Capricorn: 'Saturn',
  Aquarius: 'Saturn',
  Pisces: 'Jupiter'
};

const professionSignals = {
  student: ['Education', 'Focus'],
  teacher: ['Education', 'Wisdom'],
  doctor: ['Health', 'Peace of Mind'],
  engineer: ['Career Growth', 'Focus'],
  entrepreneur: ['Wealth', 'Career Growth'],
  artist: ['Love', 'Creativity'],
  manager: ['Leadership', 'Career Growth']
};

export const buildRecommendation = (input, gemstones) => {
  if (!gemstones.length) {
    const error = new Error('No gemstones available for recommendation');
    error.statusCode = 404;
    throw error;
  }

  const goal = input.goal;
  const zodiacPlanet = zodiacPlanetMap[input.zodiacSign];
  const profession = String(input.profession || '').toLowerCase();
  const professionMatches = Object.entries(professionSignals)
    .filter(([key]) => profession.includes(key))
    .flatMap(([, signals]) => signals);

  const ranked = gemstones.map((gemstone) => {
    let score = 45;
    const reasons = [];

    if (gemstone.recommendedFor.includes(goal)) {
      score += 25;
      reasons.push(`strongly supports ${goal}`);
    }

    if (zodiacPlanet && gemstone.planet === zodiacPlanet) {
      score += 15;
      reasons.push(`aligns with ${input.zodiacSign}'s planetary association`);
    }

    const benefitHits = gemstone.benefits.filter((benefit) => {
      return benefit === goal || professionMatches.includes(benefit);
    });

    if (benefitHits.length) {
      score += Math.min(15, benefitHits.length * 5);
      reasons.push(`matches ${benefitHits.join(', ').toLowerCase()} priorities`);
    }

    return {
      gemstone,
      matchScore: Math.min(score, 98),
      recommendationReason: reasons.length
        ? `Recommended because it ${reasons.join(' and ')}.`
        : `Recommended as a balanced option for ${goal}.`
    };
  });

  ranked.sort((a, b) => b.matchScore - a.matchScore || a.gemstone.name.localeCompare(b.gemstone.name));
  return ranked[0];
};
