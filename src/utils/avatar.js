const FEMALE_NAMES = ['emma', 'olivia', 'ava', 'isabella', 'sophia', 'mia', 'charlotte', 'amelia', 'harper', 'evelyn', 'abigail', 'emily', 'elizabeth', 'mila', 'ella', 'avery', 'sofia', 'camila', 'aria', 'scarlett', 'victoria', 'madison', 'luna', 'grace', 'chloe', 'penelope', 'layla', 'riley', 'zoey', 'nora', 'lily', 'eleanor', 'hannah', 'lillian', 'addison', 'aubrey', 'ellie', 'stella', 'natalie', 'zoe', 'leah', 'hazel', 'violet', 'aurora', 'savannah', 'audrey', 'brooklyn', 'bella', 'claire', 'skylar', 'lucy', 'paisley', 'everly', 'anna', 'caroline', 'nova', 'genesis', 'emilia', 'kennedy', 'samantha', 'maya', 'willow', 'kinsley', 'naomi', 'aaliyah', 'elena', 'sarah', 'ariana', 'allison', 'gabriella', 'alice', 'madelyn', 'cora', 'ruby', 'eva', 'serenity', 'autumn', 'adeline', 'hailey', 'gianna', 'valentina', 'isla', 'eliana', 'quinn', 'nevaeh', 'ivy', 'sadie', 'piper', 'lydia', 'alexa', 'josephine', 'emery', 'julia', 'delilah', 'arianna', 'vivian', 'kaylee', 'sophie', 'brielle', 'madeline', 'mary', 'priyanka', 'deepika', 'katrina', 'alia', 'kareena', 'shraddha', 'anushka', 'kriti', 'kiara', 'sara', 'janhvi', 'anya', 'girl'];

export const getAvatarUrl = (userOrReview, isPlatformUser = true, isCurrentUser = false, currentUserPhoto = null) => {
  const photoUrl = isCurrentUser ? currentUserPhoto : userOrReview?.photoURL;
  if (photoUrl && photoUrl.includes('firebasestorage')) return photoUrl;

  const seedName = userOrReview?.displayName || userOrReview?.authorName || userOrReview?.email || userOrReview?.authorEmail || userOrReview?.author || 'User';
  
  if (!isPlatformUser) {
    if (userOrReview?.author_details?.avatar_path) {
      let path = userOrReview.author_details.avatar_path;
      return path.startsWith('/https') ? path.substring(1) : `/tmdb-images/w150_and_h150_face${path}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(seedName)}&background=random`;
  }

  const isFemale = FEMALE_NAMES.some(n => seedName.toLowerCase().includes(n));
  if (isFemale) {
    return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seedName)}&backgroundColor=transparent&hair=long01,long02,long03,long04,long05`;
  }
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seedName)}&backgroundColor=transparent&glassesProbability=100&hair=short16`;
};