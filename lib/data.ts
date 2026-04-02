// Data management utilities for localStorage-based state
// This provides a centralized data layer that can be easily migrated to a database later

export type UserRole = 'admin' | 'farm_staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  farmId: string;
  createdAt: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  totalArea: number;
  ownerId: string;
  createdAt: string;
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  plantingDate: string;
  estimatedHarvestDate: string;
  area: number;
  status: 'planning' | 'growing' | 'harvesting' | 'completed';
  notes: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  cropId: string;
  farmId: string;
  type: 'fertilizing' | 'irrigation' | 'pest_control' | 'pruning' | 'other';
  date: string;
  description: string;
  notes: string;
  createdAt: string;
}

export interface Harvest {
  id: string;
  cropId: string;
  farmId: string;
  date: string;
  quantity: number;
  unit: string;
  grade: string;
  destination: string;
  notes: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  farmId: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  notes: string;
  createdAt: string;
}

export interface WeatherData {
  id: string;
  farmId: string;
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
}

export interface Tip {
  id: string;
  category: string;
  title: string;
  content: string;
  source: string;
}

// Local Storage Keys
const STORAGE_KEYS = {
  users: 'farm_users',
  currentUser: 'farm_current_user',
  farms: 'farm_farms',
  crops: 'farm_crops',
  activities: 'farm_activities',
  harvests: 'farm_harvests',
  expenses: 'farm_expenses',
  weather: 'farm_weather',
  tips: 'farm_tips',
};

// Initialize default data
export function initializeData() {
  if (typeof window === 'undefined') return;

  // Check if data already exists
  if (localStorage.getItem(STORAGE_KEYS.users)) return;

  // Create default admin user
  const defaultUser: User = {
    id: 'admin_001',
    email: 'admin@farm.com',
    name: 'Farm Administrator',
    role: 'admin',
    farmId: 'farm_001',
    createdAt: new Date().toISOString(),
  };

  // Create default farm
  const defaultFarm: Farm = {
    id: 'farm_001',
    name: 'Main Greenhouse Farm',
    location: 'Agricultural District',
    totalArea: 5000,
    ownerId: 'admin_001',
    createdAt: new Date().toISOString(),
  };

  // Store default data
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify([defaultUser]));
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(defaultUser));
  localStorage.setItem(STORAGE_KEYS.farms, JSON.stringify([defaultFarm]));
  localStorage.setItem(STORAGE_KEYS.crops, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.harvests, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.weather, JSON.stringify([]));
}

// User functions
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(STORAGE_KEYS.currentUser);
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: User) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
}

export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(STORAGE_KEYS.users);
  return users ? JSON.parse(users) : [];
}

export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...user,
    id: 'user_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const users = getAllUsers();
  users.push(newUser);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }
  return newUser;
}

// Farm functions
export function getFarms(): Farm[] {
  if (typeof window === 'undefined') return [];
  const farms = localStorage.getItem(STORAGE_KEYS.farms);
  return farms ? JSON.parse(farms) : [];
}

export function getFarmById(id: string): Farm | null {
  const farms = getFarms();
  return farms.find((f) => f.id === id) || null;
}

export function createFarm(farm: Omit<Farm, 'id' | 'createdAt'>): Farm {
  const newFarm: Farm = {
    ...farm,
    id: 'farm_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const farms = getFarms();
  farms.push(newFarm);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.farms, JSON.stringify(farms));
  }
  return newFarm;
}

export function updateFarm(id: string, updates: Partial<Farm>): Farm | null {
  const farms = getFarms();
  const farm = farms.find((f) => f.id === id);
  if (!farm) return null;
  Object.assign(farm, updates);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.farms, JSON.stringify(farms));
  }
  return farm;
}

// Crop functions
export function getCrops(farmId?: string): Crop[] {
  if (typeof window === 'undefined') return [];
  const crops = localStorage.getItem(STORAGE_KEYS.crops);
  const allCrops = crops ? JSON.parse(crops) : [];
  return farmId ? allCrops.filter((c: Crop) => c.farmId === farmId) : allCrops;
}

export function getCropById(id: string): Crop | null {
  const crops = getCrops();
  return crops.find((c) => c.id === id) || null;
}

export function createCrop(crop: Omit<Crop, 'id' | 'createdAt'>): Crop {
  const newCrop: Crop = {
    ...crop,
    id: 'crop_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const crops = getCrops();
  crops.push(newCrop);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.crops, JSON.stringify(crops));
  }
  return newCrop;
}

export function updateCrop(id: string, updates: Partial<Crop>): Crop | null {
  const crops = getCrops();
  const crop = crops.find((c) => c.id === id);
  if (!crop) return null;
  Object.assign(crop, updates);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.crops, JSON.stringify(crops));
  }
  return crop;
}

export function deleteCrop(id: string): boolean {
  const crops = getCrops();
  const index = crops.findIndex((c) => c.id === id);
  if (index === -1) return false;
  crops.splice(index, 1);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.crops, JSON.stringify(crops));
  }
  return true;
}

// Activity functions
export function getActivities(farmId?: string, cropId?: string): Activity[] {
  if (typeof window === 'undefined') return [];
  const activities = localStorage.getItem(STORAGE_KEYS.activities);
  let allActivities = activities ? JSON.parse(activities) : [];
  if (farmId) allActivities = allActivities.filter((a: Activity) => a.farmId === farmId);
  if (cropId) allActivities = allActivities.filter((a: Activity) => a.cropId === cropId);
  return allActivities;
}

export function createActivity(activity: Omit<Activity, 'id' | 'createdAt'>): Activity {
  const newActivity: Activity = {
    ...activity,
    id: 'activity_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const activities = getActivities();
  activities.push(newActivity);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.activities, JSON.stringify(activities));
  }
  return newActivity;
}

// Harvest functions
export function getHarvests(farmId?: string, cropId?: string): Harvest[] {
  if (typeof window === 'undefined') return [];
  const harvests = localStorage.getItem(STORAGE_KEYS.harvests);
  let allHarvests = harvests ? JSON.parse(harvests) : [];
  if (farmId) allHarvests = allHarvests.filter((h: Harvest) => h.farmId === farmId);
  if (cropId) allHarvests = allHarvests.filter((h: Harvest) => h.cropId === cropId);
  return allHarvests;
}

export function createHarvest(harvest: Omit<Harvest, 'id' | 'createdAt'>): Harvest {
  const newHarvest: Harvest = {
    ...harvest,
    id: 'harvest_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const harvests = getHarvests();
  harvests.push(newHarvest);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.harvests, JSON.stringify(harvests));
  }
  return newHarvest;
}

// Expense functions
export function getExpenses(farmId?: string): Expense[] {
  if (typeof window === 'undefined') return [];
  const expenses = localStorage.getItem(STORAGE_KEYS.expenses);
  let allExpenses = expenses ? JSON.parse(expenses) : [];
  if (farmId) allExpenses = allExpenses.filter((e: Expense) => e.farmId === farmId);
  return allExpenses;
}

export function createExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const newExpense: Expense = {
    ...expense,
    id: 'expense_' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  const expenses = getExpenses();
  expenses.push(newExpense);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
  }
  return newExpense;
}

// Weather functions
export function getWeatherData(farmId: string): WeatherData[] {
  if (typeof window === 'undefined') return [];
  const weather = localStorage.getItem(STORAGE_KEYS.weather);
  let allWeather = weather ? JSON.parse(weather) : [];
  return allWeather.filter((w: WeatherData) => w.farmId === farmId);
}

export function createWeatherData(data: Omit<WeatherData, 'id'>): WeatherData {
  const newData: WeatherData = {
    ...data,
    id: 'weather_' + Date.now(),
  };
  const weather = getWeatherData(data.farmId);
  weather.push(newData);
  if (typeof window !== 'undefined') {
    const allWeather = localStorage.getItem(STORAGE_KEYS.weather);
    const parsed = allWeather ? JSON.parse(allWeather) : [];
    parsed.push(newData);
    localStorage.setItem(STORAGE_KEYS.weather, JSON.stringify(parsed));
  }
  return newData;
}

// Tip functions
export function getTips(category?: string): Tip[] {
  if (typeof window === 'undefined') return [];
  const tips = localStorage.getItem(STORAGE_KEYS.tips);
  let allTips = tips ? JSON.parse(tips) : [];
  if (category) allTips = allTips.filter((t: Tip) => t.category === category);
  return allTips;
}

export function initializeTips() {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(STORAGE_KEYS.tips)) return;

  const defaultTips: Tip[] = [
    {
      id: 'tip_001',
      category: 'irrigation',
      title: 'Optimal Watering Schedule',
      content: 'Water in early morning to reduce evaporation and prevent fungal diseases.',
      source: 'Agricultural Extension',
    },
    {
      id: 'tip_002',
      category: 'pest_control',
      title: 'Natural Pest Management',
      content: 'Use neem oil spray for common greenhouse pests. Apply in early morning or late evening.',
      source: 'Organic Farming Guide',
    },
    {
      id: 'tip_003',
      category: 'fertilizing',
      title: 'Balanced Nutrition',
      content: 'Apply NPK fertilizer at a 2:1:1 ratio for balanced crop growth.',
      source: 'Soil Science Journal',
    },
    {
      id: 'tip_004',
      category: 'general',
      title: 'Temperature Control',
      content: 'Maintain temperature between 20-25°C for optimal growth in greenhouses.',
      source: 'Climate Control Guidelines',
    },
  ];

  localStorage.setItem(STORAGE_KEYS.tips, JSON.stringify(defaultTips));
}
