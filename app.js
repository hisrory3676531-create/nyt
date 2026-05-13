(() => {
  // --- CONSTANTS ---
  const GEMINI_API_KEY = "AIzaSyCoc86_dpfX8iKVzr-PCoiO-99tyx4-LMA"; // ВСТАВЬТЕ ВАШ КЛЮЧ СЮДА
  const LS_PROFILE = "gh_profile_v1";
  const LS_RUN = "gh_run_v1";

  const STEPS_GOAL = 10000;

  const el = (id) => document.getElementById(id);

  const onboardingView = el("onboardingView");
  const dashboardView = el("dashboardView");
  const appHeader = el("appHeader");

  const resetBtn = el("resetBtn");

  const ageInput = el("ageInput");
  const genderInput = el("genderInput");
  const heightInput = el("heightInput");
  const weightInput = el("weightInput");
  const activityInput = el("activityInput");
  const exclusionsInput = el("exclusionsInput");

  // Новые поля онбординга
  const healthChronicInput = el("healthChronicInput");
  const healthDigestionInput = el("healthDigestionInput");
  const lifestyleSleepInput = el("lifestyleSleepInput");
  const lifestyleStressInput = el("lifestyleStressInput");
  const behaviorPrefInput = el("behaviorPrefInput");
  const behaviorMealsInput = el("behaviorMealsInput");
  const behaviorCookTimeInput = el("behaviorCookTimeInput");
  const behaviorCravingsGroup = el("behaviorCravingsGroup");
  const inventoryInput = el("inventoryInput");
  const equipmentInput = el("equipmentInput");
  const hasPrepInput = el("hasPrepInput");
  const disclaimerAgreeInput = el("disclaimerAgreeInput");
  const disclaimerError = el("disclaimerError");

  const flagPregnancyInput = el("flagPregnancyInput");
  const flagEdInput = el("flagEdInput");
  const flagKidneyInput = el("flagKidneyInput");
  const flagGoutInput = el("flagGoutInput");

  const duration7Btn = el("duration7Btn");
  const duration14Btn = el("duration14Btn");

  const analyzeBtn = el("analyzeBtn");

  const editMacrosBtn = el("editMacrosBtn");
  const editMacrosModal = el("editMacrosModal");
  const closeMacrosModal = el("closeMacrosModal");
  const saveMacrosBtn = el("saveMacrosBtn");
  const resetMacrosBtn = el("resetMacrosBtn");
  const editProteinInput = el("editProteinInput");
  const editFatsInput = el("editFatsInput");
  const editCarbsInput = el("editCarbsInput");
  const editCaloriesDisplay = el("editCaloriesDisplay");
  const analyzeStatus = el("analyzeStatus");
  const onboardingError = el("onboardingError");

  const marathonProgress = el("marathonProgress");
  const calendarStrip = el("calendarStrip");
  const stepsInput = el("stepsInput");
  const stepsValue = el("stepsValue");
  const stepsRing = el("stepsRing");

  const exclusionsDisclaimer = el("exclusionsDisclaimer");
  const mealCards = el("mealCards");

  const targetCalories = el("targetCalories");
  const macroSummary = el("macroSummary");
  const macroTotalsInline = el("macroTotalsInline");

  const macrosCalories = el("macrosCalories");
  const macrosProtein = el("macrosProtein");
  const macrosCarbs = el("macrosCarbs");
  const macrosFats = el("macrosFats");

  const barCalories = el("barCalories");
  const barProtein = el("barProtein");
  const barCarbs = el("barCarbs");
  const barFats = el("barFats");

  const weightInputToday = el("weightInputToday");
  const shoppingListModal = el("shoppingListModal");
  const openShoppingListBtn = el("openShoppingListBtn");
  const closeShoppingListBtn = el("closeShoppingListBtn");
  const copyShoppingListBtn = el("copyShoppingListBtn");
  const personalAIAdvice = el("personalAIAdvice");
  const safetyBanner = el("safetyBanner");

  const qualityScore = el("qualityScore");
  const qualityVeg = el("qualityVeg");
  const qualityVegBar = el("qualityVegBar");
  const qualityFruit = el("qualityFruit");
  const qualityFruitBar = el("qualityFruitBar");
  const qualityWater = el("qualityWater");
  const qualityWaterBar = el("qualityWaterBar");
  const qualityFiber = el("qualityFiber");
  const qualityFiberBar = el("qualityFiberBar");
  const qualityFish = el("qualityFish");
  const qualityLegumes = el("qualityLegumes");
  const qualityTip = el("qualityTip");

  const waterMlInput = el("waterMlInput");
  const hungerInput = el("hungerInput");
  const energyInput = el("energyInput");
  const cravingsLevelInput = el("cravingsLevelInput");
  const digestionComfortInput = el("digestionComfortInput");

  let weightChartInstance = null;
  const closeRecipeBtn = el("closeRecipeBtn");
  const modalCategory = el("modalCategory");
  const modalName = el("modalName");
  const modalIngredients = el("modalIngredients");
  const modalRecipe = el("modalRecipe");
  const modalKcal = el("modalKcal");
  const modalProt = el("modalProt");
  const modalCarb = el("modalCarb");
  const modalFat = el("modalFat");

  let selectedDays = 7;
  let selectedGoal = "lose";

  let appState = {
    profile: null,
    run: null,
    selectedDate: null,
  };

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  const toLocalISODate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const diffDays = (startISO, endISO) => {
    const a = new Date(startISO);
    const b = new Date(endISO);
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    return Math.round((b.getTime() - a.getTime()) / (24 * 60 * 60 * 1000));
  };

  const animateViewSwitch = (fromEl, toEl) => {
    fromEl.classList.add("view-hidden");
    window.setTimeout(() => {
      fromEl.classList.add("hidden");
      toEl.classList.remove("hidden");
      // eslint-disable-next-line no-unused-expressions
      toEl.offsetHeight;
      toEl.classList.remove("view-hidden");
    }, 260);
  };

  const safeJsonParse = (raw) => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  const loadStorage = () => {
    const p = safeJsonParse(localStorage.getItem(LS_PROFILE) || "");
    const r = safeJsonParse(localStorage.getItem(LS_RUN) || "");
    if (p && r) {
      if (!p.exclusionsDisplay && Array.isArray(p.exclusions)) {
        p.exclusionsDisplay = p.exclusions;
      }
      if (!p.exclusionsDisplay) {
        p.exclusionsDisplay = [];
      }
      if (!p.exclusionsNormalized) {
        p.exclusionsNormalized = normalizeExclusions(p.exclusionsDisplay);
      }

      if (!p.maxCookingTime) p.maxCookingTime = Number(p.behavior?.cookTime) || 30;
      if (!p.equipment) p.equipment = "any";
      if (typeof p.hasPrep !== "boolean") p.hasPrep = false;
      if (typeof p.disclaimerAgree !== "boolean") p.disclaimerAgree = false;
      if (!p.safety) p.safety = { pregnancy: false, ed: false, kidney: false, gout: false };
      if (typeof p.safety.pregnancy !== "boolean") p.safety.pregnancy = false;
      if (typeof p.safety.ed !== "boolean") p.safety.ed = false;
      if (typeof p.safety.kidney !== "boolean") p.safety.kidney = false;
      if (typeof p.safety.gout !== "boolean") p.safety.gout = false;

      appState.profile = p;
      appState.run = r;
      return true;
    }
    return false;
  };

  const saveStorage = () => {
    if (appState.profile) localStorage.setItem(LS_PROFILE, JSON.stringify(appState.profile));
    if (appState.run) localStorage.setItem(LS_RUN, JSON.stringify(appState.run));
  };

  const planLooksEnglish = (planByDate) => {
    try {
      const firstKey = Object.keys(planByDate || {})[0];
      if (!firstKey) return false;
      const sample = planByDate[firstKey];
      const meal = sample?.breakfast || sample?.lunch || sample?.dinner || sample?.snack;
      const text = `${meal?.name || ""} ${(meal?.ingredients || []).join(" ")}`.toLowerCase();
      return /greek|chicken|salmon|oatmeal|hummus|peanut|protein|wrap|toast|bowl|quinoa/.test(text);
    } catch {
      return false;
    }
  };

  const migrateRunIfNeeded = () => {
    if (!appState.profile || !appState.run) return;

    const p = appState.profile;

    if (!p.exclusionsDisplay && Array.isArray(p.exclusions)) {
      p.exclusionsDisplay = p.exclusions;
    }
    if (!p.exclusionsDisplay) p.exclusionsDisplay = [];
    if (!p.exclusionsNormalized) p.exclusionsNormalized = normalizeExclusions(p.exclusionsDisplay);

    if (!p.maxCookingTime) p.maxCookingTime = Number(p.behavior?.cookTime) || 30;
    if (!p.equipment) p.equipment = "any";
    if (typeof p.hasPrep !== "boolean") p.hasPrep = false;
    if (typeof p.disclaimerAgree !== "boolean") p.disclaimerAgree = false;
    if (!p.safety) p.safety = { pregnancy: false, ed: false, kidney: false, gout: false };
    if (typeof p.safety.pregnancy !== "boolean") p.safety.pregnancy = false;
    if (typeof p.safety.ed !== "boolean") p.safety.ed = false;
    if (typeof p.safety.kidney !== "boolean") p.safety.kidney = false;
    if (typeof p.safety.gout !== "boolean") p.safety.gout = false;

    const run = appState.run;
    if (!run.planByDate || typeof run.planByDate !== "object") return;

    const needsPlanMigration = planLooksEnglish(run.planByDate);
    if (!needsPlanMigration) return;

    const nutrition = run.nutrition || computeNutrition(p);
    run.nutrition = nutrition;

    const rebuilt = {};
    for (let i = 0; i < run.durationDays; i += 1) {
      const date = new Date(run.startDate);
      date.setDate(date.getDate() + i);
      const iso = toLocalISODate(date);
      rebuilt[iso] = buildPlanForDay(nutrition, p.exclusionsNormalized);
    }

    run.planByDate = rebuilt;
    saveStorage();
  };

  const resetAll = () => {
    localStorage.removeItem(LS_PROFILE);
    localStorage.removeItem(LS_RUN);
    appState.profile = null;
    appState.run = null;
    appState.selectedDate = null;

    appHeader.classList.add("hidden");
    resetBtn.classList.add("hidden");
    dashboardView.classList.add("hidden");
    dashboardView.classList.add("view-hidden");
    onboardingView.classList.remove("hidden");
    onboardingView.classList.remove("view-hidden");
  };

  const activityFactor = (key) => {
    switch (key) {
      case "sedentary":
        return 1.2;
      case "light":
        return 1.375;
      case "moderate":
        return 1.55;
      case "active":
        return 1.725;
      case "very_active":
        return 1.9;
      default:
        return 1.55;
    }
  };

  const computeNutrition = (profile) => {
    if (profile.manualNutrition) {
      return { ...profile.manualNutrition };
    }
    const age = profile.age;
    const heightCm = profile.heightCm;
    const weightKg = profile.weightKg;
    const gender = profile.gender;

    const s = gender === "male" ? 5 : -161;
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + s;
    const tdee = bmr * activityFactor(profile.activity);

    let goalMultiplier = 1;
    if (profile.goal === "lose") goalMultiplier = 0.85;
    if (profile.goal === "muscle") goalMultiplier = 1.1;

    const calories = Math.round(tdee * goalMultiplier);

    const proteinPerKg = profile.goal === "muscle" ? 1.6 : profile.goal === "lose" ? 1.3 : 1.4;
    const proteinG = Math.round(weightKg * proteinPerKg);

    let fatG;
    if (gender === "female") {
      const targetPct = 0.33;
      const pctFatG = (calories * targetPct) / 9;
      const minFatG = 0.85 * weightKg;
      fatG = Math.round(Math.max(pctFatG, minFatG));
    } else {
      fatG = Math.round((calories * 0.25) / 9);
    }

    const proteinCals = proteinG * 4;
    const fatCals = fatG * 9;
    const carbCals = Math.max(0, calories - proteinCals - fatCals);
    const carbsG = Math.round(carbCals / 4);

    return {
      calories,
      proteinG,
      carbsG,
      fatG,
    };
  };

  const parseExclusionsDisplay = (raw) => {
    const cleaned = raw
      .split(/,|\n/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .map((s) => s.replace(/^(no|без)\s+/, ""));

    return Array.from(new Set(cleaned));
  };

  function normalizeExclusions(displayList) {
    const aliasMap = {
      cilantro: "кинз",
      nuts: "орех",
      nut: "орех",
      peanut: "арахис",
      "peanut butter": "арахис",
      "lactose-free": "лактоз",
      "lactose free": "лактоз",
      lactose: "лактоз",
      dairy: "молоч",
      milk: "молок",
    };

    const normalized = (displayList || [])
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .map((s) => aliasMap[s] || s)
      .flatMap((s) => {
        const out = [s];
        if (s.includes("орех")) out.push("арахис", "кешью", "миндал", "фундук");
        if (s.includes("лактоз") || s.includes("молок") || s.includes("молоч")) {
          out.push("йогурт", "молок", "сыр", "творог", "сметан", "кефир", "ряженк");
        }
        return out;
      });

    return Array.from(new Set(normalized));
  }

  const INGREDIENT_DATA = {
    "овсянка": { p: 12, f: 6, c: 60, cal: 350, type: "grain" },
    "яйца": { p: 12, f: 10, c: 1, cal: 145, type: "egg" },
    "творог": { p: 16, f: 5, c: 3, cal: 120, type: "dairy" },
    "гречка": { p: 12, f: 3, c: 62, cal: 310, type: "grain" },
    "рис": { p: 7, f: 1, c: 75, cal: 340, type: "grain" },
    "курица": { p: 22, f: 2, c: 0, cal: 110, type: "meat" },
    "индейка": { p: 22, f: 1, c: 0, cal: 105, type: "meat" },
    "говядина": { p: 20, f: 12, c: 0, cal: 190, type: "meat" },
    "печень": { p: 18, f: 4, c: 0, cal: 130, type: "meat" },
    "сердечки": { p: 16, f: 10, c: 0.8, cal: 160, type: "meat" },
    "минтай": { p: 16, f: 1, c: 0, cal: 72, type: "fish" },
    "горбуша": { p: 20, f: 6, c: 0, cal: 140, type: "fish" },
    "тунец": { p: 24, f: 1, c: 0, cal: 110, type: "fish" },
    "фасоль": { p: 9, f: 1, c: 22, cal: 125, type: "legume" },
    "кускус": { p: 12, f: 1, c: 72, cal: 350, type: "grain" },
    "макароны": { p: 12, f: 1, c: 70, cal: 340, type: "grain" },
    "картофель": { p: 2, f: 0.4, c: 16, cal: 75, type: "veg" },
    "перловка": { p: 9, f: 1, c: 66, cal: 315, type: "grain" },
    "манка": { p: 10, f: 1, c: 70, cal: 330, type: "grain" },
    "пшено": { p: 11, f: 3, c: 65, cal: 340, type: "grain" },
    "ячка": { p: 10, f: 1.3, c: 66, cal: 320, type: "grain" },
    "отруби": { p: 15, f: 4, c: 20, cal: 160, type: "grain" },
    "яблоко": { p: 0.5, f: 0, c: 12, cal: 50, type: "fruit" },
    "груша": { p: 0.5, f: 0, c: 10, cal: 42, type: "fruit" },
    "банан": { p: 1.5, f: 0, c: 22, cal: 95, type: "fruit" },
    "грейпфрут": { p: 0.7, f: 0, c: 8, cal: 35, type: "fruit" },
    "морковь": { p: 1.3, f: 0, c: 7, cal: 35, type: "veg" },
    "свекла": { p: 1.5, f: 0, c: 9, cal: 42, type: "veg" },
    "огурец": { p: 0.8, f: 0, c: 2.5, cal: 15, type: "veg" },
    "помидор": { p: 0.6, f: 0, c: 3.5, cal: 18, type: "veg" },
    "кабачок": { p: 0.6, f: 0, c: 4.5, cal: 24, type: "veg" },
    "капуста": { p: 1.8, f: 0, c: 4.7, cal: 25, type: "veg" },
    "тыква": { p: 1, f: 0, c: 6, cal: 28, type: "veg" },
    "молоко": { p: 3, f: 2.5, c: 5, cal: 55, type: "liquid" },
    "кефир": { p: 3, f: 2.5, c: 4, cal: 50, type: "liquid" },
    "ряженка": { p: 3, f: 3.5, c: 4.5, cal: 65, type: "liquid" },
    "йогурт": { p: 5, f: 3, c: 4, cal: 65, type: "dairy" },
    "томатный сок": { p: 1, f: 0, c: 4, cal: 20, type: "liquid" },
    "хлеб": { p: 8, f: 3, c: 45, cal: 240, type: "grain" },
    "хлебец": { p: 10, f: 2, c: 60, cal: 300, type: "grain" },
    "сыр": { p: 25, f: 25, c: 0, cal: 350, type: "fat" },
    "сметана": { p: 2.5, f: 15, c: 3.5, cal: 160, type: "fat" },
    "масло": { p: 0.5, f: 80, c: 0.5, cal: 720, type: "fat" },
    "вода": { p: 0, f: 0, c: 0, cal: 0, type: "liquid" },
    "чай": { p: 0, f: 0, c: 0, cal: 0, type: "liquid" }
  };

  const MEAL_LIBRARY = {
    breakfast: [
      { name: "Овсянка на воде с яблоком", ingredients: [{ name: "Овсянка", role: "carbs" }, { name: "Яблоко", role: "fixed", fixedWeight: 100 }, { name: "Вода", role: "filler", defaultWeight: 200 }], instructions: ["Залейте овсянку водой", "Варите 5-7 мин", "Добавьте нарезанное яблоко"], cookingTime: 10, mainIngredient: "овсянка", isBudget: true },
      { name: "Омлет из яиц с молоком", ingredients: [{ name: "Яйца", role: "protein" }, { name: "Молоко", role: "filler", defaultWeight: 50 }], instructions: ["Взбейте яйца с молоком", "Вылейте на сковороду", "Готовьте под крышкой 5 мин"], cookingTime: 8, mainIngredient: "яйца", isBudget: true },
      { name: "Творог 5% с яблоком", ingredients: [{ name: "Творог", role: "protein" }, { name: "Яблоко", role: "fixed", fixedWeight: 100 }], instructions: ["Выложите творог в миску", "Натрите яблоко", "Перемешайте"], cookingTime: 3, mainIngredient: "творог", isBudget: true },
      { name: "Гречка с молоком", ingredients: [{ name: "Гречка", role: "carbs" }, { name: "Молоко", role: "filler", defaultWeight: 150 }], instructions: ["Отварите гречку", "Залейте теплым молоком", "Добавьте щепотку соли"], cookingTime: 20, mainIngredient: "гречка", isBudget: true },
      { name: "Сырники запеченные", ingredients: [{ name: "Творог", role: "protein" }, { name: "Яйца", role: "filler", defaultWeight: 25 }], instructions: ["Смешайте творог, яйцо и немного муки", "Сформируйте шарики", "Запекайте в духовке 20 мин"], cookingTime: 25, mainIngredient: "творог", isBudget: true },
      { name: "Яичница с помидорами", ingredients: [{ name: "Яйца", role: "protein" }, { name: "Помидор", role: "fixed", fixedWeight: 100 }], instructions: ["Обжарьте помидоры на сковороде", "Залейте яйцами", "Посолите по вкусу"], cookingTime: 7, mainIngredient: "яйца", isBudget: true },
      { name: "Рисовая каша на молоке", ingredients: [{ name: "Рис", role: "carbs" }, { name: "Молоко", role: "filler", defaultWeight: 150 }], instructions: ["Сварите рис в воде наполовину", "Добавьте молоко и варите до готовности", "Дайте настояться под крышкой"], cookingTime: 25, mainIngredient: "рис", isBudget: true },
      { name: "Бутерброды с сыром", ingredients: [{ name: "Хлеб", role: "carbs" }, { name: "Сыр", role: "fixed", fixedWeight: 30 }], instructions: ["Нарежьте хлеб ломтиками", "Сверху положите сыр", "Подогрейте в микроволновке 30 сек"], cookingTime: 2, mainIngredient: "хлеб", isBudget: true },
      { name: "Творожная запеканка", ingredients: [{ name: "Творог", role: "protein" }, { name: "Яйца", role: "filler", defaultWeight: 50 }], instructions: ["Смешайте творог с яйцом", "Выложите в форму для запекания", "Готовьте при 180 градусах 30 минут"], cookingTime: 40, mainIngredient: "творог", isBudget: true },
      { name: "Овсяноблин классический", ingredients: [{ name: "Овсянка", role: "carbs" }, { name: "Яйца", role: "protein" }], instructions: ["Перемешайте яйцо и овсянку", "Вылейте на разогретую сковороду", "Обжаривайте с двух сторон до золотистого цвета"], cookingTime: 10, mainIngredient: "овсянка", isBudget: true },
      { name: "Гречка с яйцом вкрутую", ingredients: [{ name: "Гречка", role: "carbs" }, { name: "Яйца", role: "fixed", fixedWeight: 50 }], instructions: ["Отварите гречку до готовности", "Сварите яйцо вкрутую", "Подавайте гречку с нарезанным яйцом"], cookingTime: 20, mainIngredient: "гречка", isBudget: true },
      { name: "Манная каша", ingredients: [{ name: "Молоко", role: "filler", defaultWeight: 200 }, { name: "Манка", role: "carbs" }], instructions: ["Доведите молоко до кипения", "Тонкой струйкой всыпайте манку постоянно помешивая", "Варите на медленном огне 5 минут"], cookingTime: 10, mainIngredient: "манка", isBudget: true },
      { name: "Пшенная каша с тыквой", ingredients: [{ name: "Пшено", role: "carbs" }, { name: "Тыква", role: "fixed", fixedWeight: 150 }], instructions: ["Отварите пшено в воде", "Добавьте тертую тыкву и немного молока", "Томите на медленном огне до мягкости"], cookingTime: 30, mainIngredient: "пшено", isBudget: true },
      { name: "Перловка с овощами", ingredients: [{ name: "Перловка", role: "carbs" }, { name: "Морковь", role: "fixed", fixedWeight: 50 }], instructions: ["Заранее замоченную перловку отварите", "Обжарьте морковь", "Смешайте и прогрейте вместе"], cookingTime: 45, mainIngredient: "перловка", isBudget: true },
      { name: "Творог со сметаной", ingredients: [{ name: "Творог", role: "protein" }, { name: "Сметана", role: "fixed", fixedWeight: 30 }], instructions: ["Выложите творог в тарелку", "Сверху добавьте сметану", "Можно добавить капельку сахарозаменителя"], cookingTime: 2, mainIngredient: "творог", isBudget: true },
      { name: "Яйца всмятку с хлебцами", ingredients: [{ name: "Яйца", role: "protein" }, { name: "Хлебец", role: "fixed", fixedWeight: 20 }], instructions: ["Варите яйца 4-5 минут после закипания", "Подавайте с цельнозерновыми хлебцами", "Посолите по вкусу"], cookingTime: 8, mainIngredient: "яйца", isBudget: true },
      { name: "Творог с бананом", ingredients: [{ name: "Творог", role: "protein" }, { name: "Банан", role: "fixed", fixedWeight: 100 }], instructions: ["Смешайте творог с нарезанным бананом", "Разомните вилкой для более кремовой консистенции", "Тщательно перемешайте"], cookingTime: 5, mainIngredient: "творог", isBudget: true },
      { name: "Оладьи из кабачков", ingredients: [{ name: "Кабачок", role: "fixed", fixedWeight: 200 }, { name: "Яйца", role: "protein" }], instructions: ["Натрите кабачок и отожмите лишнюю влагу", "Добавьте яйцо и капельку муки", "Обжаривайте небольшими порциями на сковороде"], cookingTime: 20, mainIngredient: "кабачок", isBudget: true },
      { name: "Рис с яйцом по-восточному", ingredients: [{ name: "Рис", role: "carbs" }, { name: "Яйца", role: "protein" }], instructions: ["Отварите рис", "Обжарьте вареный рис на сковороде", "Влейте взбитое яйцо и постоянно мешайте до готовности"], cookingTime: 15, mainIngredient: "рис", isBudget: true },
      { name: "Гренки из батона", ingredients: [{ name: "Хлеб", role: "carbs" }, { name: "Яйца", role: "filler", defaultWeight: 50 }], instructions: ["Окуните ломтики хлеба во взбитое яйцо", "Обжарьте на сковороде с двух сторон", "Подавайте горячими"], cookingTime: 10, mainIngredient: "хлеб", isBudget: true },
      { name: "Ячневая каша на молоке", ingredients: [{ name: "Ячка", role: "carbs" }, { name: "Молоко", role: "filler", defaultWeight: 150 }], instructions: ["Промойте ячневую крупу", "Варите в смеси воды и молока до вязкости", "Дайте каше потомиться 10 минут"], cookingTime: 25, mainIngredient: "ячка", isBudget: true },
      { name: "Творог с тертой морковью", ingredients: [{ name: "Творог", role: "protein" }, { name: "Морковь", role: "fixed", fixedWeight: 100 }], instructions: ["Натрите свежую морковь на мелкой терке", "Смешайте с творогом", "Для лучшего усвоения добавьте каплю масла"], cookingTime: 5, mainIngredient: "творог", isBudget: true },
      { name: "Омлет со шпинатом (или зеленью)", ingredients: [{ name: "Яйца", role: "protein" }, { name: "Капуста", role: "fixed", fixedWeight: 50 }], instructions: ["Мелко нарежьте зелень или капусту", "Смешайте с яйцами", "Томите под крышкой на медленном огне"], cookingTime: 10, mainIngredient: "яйца", isBudget: true },
      { name: "Пшенка с яблоком", ingredients: [{ name: "Пшено", role: "carbs" }, { name: "Яблоко", role: "fixed", fixedWeight: 100 }], instructions: ["Сварите рассыпчатую пшенную кашу", "За 5 минут до готовности добавьте кубики яблок", "Перемешайте и дайте постоять"], cookingTime: 25, mainIngredient: "пшено", isBudget: true },
      { name: "Ленивая овсянка", ingredients: [{ name: "Овсянка", role: "carbs" }, { name: "Кефир", role: "filler", defaultWeight: 150 }], instructions: ["С вечера залейте овсянку кефиром", "Уберите в холодильник на ночь", "Утром просто перемешайте и ешьте"], cookingTime: 2, mainIngredient: "овсянка", isBudget: true }
    ],
    lunch: [
      { name: "Экспресс-салат с тунцом и фасолью", ingredients: [{ name: "Тунец", role: "protein" }, { name: "Фасоль", role: "carbs" }, { name: "Огурец", role: "fixed", fixedWeight: 150 }], instructions: ["Слейте жидкость из консервов", "Смешайте тунец, фасоль и нарезанный огурец", "Заправьте лимонным соком"], cookingTime: 5, mainIngredient: "тунец", isFish: true, isBudget: true },
      { name: "Сковородка с индейкой и кускусом", ingredients: [{ name: "Индейка", role: "protein" }, { name: "Кускус", role: "carbs" }], instructions: ["Мелко нарежьте индейку и быстро обжарьте (7 мин)", "Залейте кускус кипятком на 5 минут", "Смешайте всё вместе"], cookingTime: 12, mainIngredient: "индейка", isBudget: true },
      { name: "Лаваш с курицей и овощами", ingredients: [{ name: "Курица", role: "protein" }, { name: "Хлебец", role: "carbs", defaultWeight: 50 }], instructions: ["Используйте готовую или быстро обжаренную грудку", "Заверните мясо и много овощей в лаваш или тонкий хлебец", "Прогрейте на сухой сковороде 2 минуты"], cookingTime: 10, mainIngredient: "курица", isBudget: true },
      { name: "Гречневая каша с яйцом и зеленью", ingredients: [{ name: "Яйца", role: "protein" }, { name: "Гречка", role: "carbs" }], instructions: ["Используйте заранее отваренную или быстрозавариваемую гречку", "Добавьте рубленые вареные яйца и много зелени", "Прогрейте с каплей масла"], cookingTime: 10, mainIngredient: "яйца", isBudget: true, requiresPrep: true },
      { name: "Гречка с отварной грудкой", ingredients: [{ name: "Курица", role: "protein" }, { name: "Гречка", role: "carbs" }], instructions: ["Сварите гречку", "Отварите грудку", "Подавайте со свежим огурцом"], cookingTime: 25, mainIngredient: "курица", isBudget: true },
      { name: "Минтай запеченный с морковью", ingredients: [{ name: "Минтай", role: "protein" }, { name: "Морковь", role: "fixed", fixedWeight: 150 }], instructions: ["Нарежьте рыбу порционно", "Покройте слоем тертой моркови", "Запекайте в духовке 30 минут"], cookingTime: 30, mainIngredient: "минтай", isFish: true, isBudget: true },
      { name: "Макароны с фаршем индейки", ingredients: [{ name: "Индейка", role: "protein" }, { name: "Макароны", role: "carbs" }], instructions: ["Отварите макароны из твердых сортов", "Обжарьте фарш индейки с луком", "Соедините макароны с мясом"], cookingTime: 20, mainIngredient: "индейка", isBudget: true },
      { name: "Рис с тефтелями из говядины", ingredients: [{ name: "Говядина", role: "protein" }, { name: "Рис", role: "carbs" }], instructions: ["Сформируйте небольшие тефтели", "Тушите их в небольшом количестве воды", "Подавайте с вареным рисом"], cookingTime: 45, mainIngredient: "говядина", isBudget: false },
      { name: "Куриная печень с гречкой", ingredients: [{ name: "Печень", role: "protein" }, { name: "Гречка", role: "carbs" }], instructions: ["Промойте и нарежьте печень", "Быстро обжарьте и потушите с луком 10 мин", "Подавайте с рассыпчатой гречкой"], cookingTime: 25, mainIngredient: "печень", isBudget: true },
      { name: "Борщ с говядиной", ingredients: [{ name: "Говядина", role: "protein" }, { name: "Свекла", role: "fixed", fixedWeight: 100 }, { name: "Капуста", role: "fixed", fixedWeight: 100 }], instructions: ["Сварите бульон из говядины", "Добавьте нарезанные овощи по очереди", "Томите на медленном огне до мягкости"], cookingTime: 90, mainIngredient: "говядина", isBudget: false },
      { name: "Щи из свежей капусты", ingredients: [{ name: "Курица", role: "protein" }, { name: "Капуста", role: "fixed", fixedWeight: 200 }], instructions: ["Сварите легкий куриный бульон", "Добавьте много свежей капусты и морковь", "Варите до готовности овощей"], cookingTime: 40, mainIngredient: "курица", isBudget: true },
      { name: "Плов из индейки", ingredients: [{ name: "Индейка", role: "protein" }, { name: "Рис", role: "carbs" }, { name: "Морковь", role: "fixed", fixedWeight: 100 }], instructions: ["Нарежьте индейку и морковь", "Обжарьте вместе, добавьте рис и воду", "Варите под плотно закрытой крышкой"], cookingTime: 50, mainIngredient: "индейка", isBudget: true },
      { name: "Горбуша на пару с рисом", ingredients: [{ name: "Горбуша", role: "protein" }, { name: "Рис", role: "carbs" }], instructions: ["Приготовьте стейк горбуши на пару (15 мин)", "Отварите длиннозерный рис", "Сбрызните рыбу лимонным соком"], cookingTime: 25, mainIngredient: "горбуша", isFish: true, isBudget: false },
      { name: "Запеченный картофель с курицей", ingredients: [{ name: "Курица", role: "protein" }, { name: "Картофель", role: "carbs" }], instructions: ["Нарежьте курицу и картофель дольками", "Посолите, добавьте специи", "Запекайте в форме под фольгой 40 мин"], cookingTime: 50, mainIngredient: "курица", isBudget: true },
      { name: "Котлеты из минтая с пюре", ingredients: [{ name: "Минтай", role: "protein" }, { name: "Картофель", role: "carbs" }], instructions: ["Сделайте фарш из филе минтая", "Сформируйте и пожарьте котлеты", "Подавайте с картофельным пюре (без масла)"], cookingTime: 40, mainIngredient: "минтай", isFish: true, isBudget: true },
      { name: "Индейка со стручковой фасолью", ingredients: [{ name: "Индейка", role: "protein" }, { name: "Капуста", role: "fixed", fixedWeight: 200 }], instructions: ["Нарежьте индейку полосками и обжарьте", "Добавьте фасоль (или капусту) и потушите", "Посолите и добавьте чеснок"], cookingTime: 20, mainIngredient: "индейка", isBudget: true },
      { name: "Перловка с куриными сердечками", ingredients: [{ name: "Сердечки", role: "protein" }, { name: "Перловка", role: "carbs" }], instructions: ["Тщательно промойте сердечки и потушите 30 мин", "Добавьте готовую перловую крупу", "Томите вместе 15 минут для обмена вкусами"], cookingTime: 60, mainIngredient: "сердечки", isBudget: true },
      { name: "Суп-пюре из тыквы с грудкой", ingredients: [{ name: "Курица", role: "protein" }, { name: "Тыква", role: "fixed", fixedWeight: 250 }], instructions: ["Сварите тыкву и взбейте блендером", "Добавьте нарезанную готовую грудку", "Подогрейте всё вместе"], cookingTime: 30, mainIngredient: "курица", isBudget: true },
      { name: "Макароны с говяжьим гуляшом", ingredients: [{ name: "Говядина", role: "protein" }, { name: "Макароны", role: "carbs" }], instructions: ["Мелко нарежьте говядину и долго тушите (1 час)", "Отварите макароны", "Подавайте с мясной подливой"], cookingTime: 80, mainIngredient: "говядина", isBudget: false },
      { name: "Рис с рыбными фрикадельками", ingredients: [{ name: "Минтай", role: "protein" }, { name: "Рис", role: "carbs" }], instructions: ["Из рыбного фарша сделайте шарики", "Сварите их в подсоленной воде", "Подавайте с отварным рисом"], cookingTime: 30, mainIngredient: "минтай", isFish: true, isBudget: true },
      { name: "Запеканка из индейки и кабачков", ingredients: [{ name: "Индейка", role: "protein" }, { name: "Кабачок", role: "fixed", fixedWeight: 200 }], instructions: ["Слоями выложите фарш индейки и кабачки", "Залейте взбитым яйцом", "Запекайте в духовке до румяной корочки"], cookingTime: 40, mainIngredient: "индейка", isBudget: true },
      { name: "Голубцы ленивые", ingredients: [{ name: "Говядина", role: "protein" }, { name: "Капуста", role: "fixed", fixedWeight: 150 }, { name: "Рис", role: "carbs" }], instructions: ["Смешайте фарш, рис и мелко рубленную капусту", "Сформируйте котлеты и залейте томатом", "Тушите на медленном огне до готовности"], cookingTime: 50, mainIngredient: "говядина", isBudget: false },
      { name: "Курица карри с рисом", ingredients: [{ name: "Курица", role: "protein" }, { name: "Рис", role: "carbs" }], instructions: ["Кусочки курицы обжарьте со специями карри", "Добавьте немного воды и потушите", "Подавайте с рассыпчатым белым рисом"], cookingTime: 25, mainIngredient: "курица", isBudget: true },
      { name: "Печень по-строгановски с пюре", ingredients: [{ name: "Печень", role: "protein" }, { name: "Картофель", role: "carbs" }], instructions: ["Нарежьте печень соломкой", "Потушите в небольшом количестве сметаны", "Подавайте с картофельным пюре"], cookingTime: 35, mainIngredient: "печень", isBudget: true },
      { name: "Рагу из говядины с овощами", ingredients: [{ name: "Говядина", role: "protein" }, { name: "Морковь", role: "fixed", fixedWeight: 100 }, { name: "Капуста", role: "fixed", fixedWeight: 150 }], instructions: ["Крупно нарежьте мясо и овощи", "Долго томите в казане или глубокой сковороде", "Добавьте лавровый лист и перец горошком"], cookingTime: 90, mainIngredient: "говядина", isBudget: false },
      { name: "Котлеты куриные с макаронами", ingredients: [{ name: "Курица", role: "protein" }, { name: "Макароны", role: "carbs" }], instructions: ["Приготовьте домашний куриный фарш", "Пожарьте котлеты без лишнего жира", "Отварите макароны твердых сортов"], cookingTime: 30, mainIngredient: "курица", isBudget: true },
      { name: "Рис с овощной смесью и индейкой", ingredients: [{ name: "Индейка", role: "protein" }, { name: "Рис", role: "carbs" }, { name: "Морковь", role: "fixed", fixedWeight: 200 }], instructions: ["Обжарьте индейку", "Добавьте тертую морковь и вареный рис", "Быстро прогрейте всё вместе на сильном огне"], cookingTime: 20, mainIngredient: "индейка", isBudget: true },
      { name: "Горбуша запеченная с картофелем", ingredients: [{ name: "Горбуша", role: "protein" }, { name: "Картофель", role: "carbs" }], instructions: ["Стейк горбуши и дольки картофеля выложите на противень", "Накройте фольгой", "Запекайте 35 минут при 190 градусах"], cookingTime: 40, mainIngredient: "горбуша", isFish: true, isBudget: false },
      { name: "Перловка с говядиной", ingredients: [{ name: "Говядина", role: "protein" }, { name: "Перловка", role: "carbs" }], instructions: ["Потушите мясо до мягкости", "Добавьте готовую перловую крупу", "Томите вместе 15 минут для обмена вкусами"], cookingTime: 80, mainIngredient: "говядина", isBudget: false }
    ],
    dinner: [
      { name: "Минтай в томате", ingredients: [{ name: "Минтай", role: "protein" }, { name: "Помидор", role: "fixed", fixedWeight: 100 }], instructions: ["Нарежьте рыбу", "Залейте томатным соком или соусом", "Тушите под крышкой 15 мин"], cookingTime: 20, mainIngredient: "минтай", isFish: true, isBudget: true },
      { name: "Курица с брокколи", ingredients: [{ name: "Курица", role: "protein" }, { name: "Капуста", role: "fixed", fixedWeight: 200 }], instructions: ["Грудку приготовьте на гриле или сковороде", "Брокколи (или капусту) припустите в кипятке", "Соедините в тарелке"], cookingTime: 15, mainIngredient: "курица", isBudget: true },
      { name: "Творог с кефиром и огурцом", ingredients: [{ name: "Творог", role: "protein" }, { name: "Кефир", role: "filler", defaultWeight: 100 }, { name: "Огурец", role: "fixed", fixedWeight: 100 }], instructions: ["Смешайте творог и кефир в миске", "Нарежьте огурец мелкими кубиками", "Добавьте свежую зелень (укроп)"], cookingTime: 5, mainIngredient: "творог", isBudget: true },
      { name: "Паровые котлеты из индейки", ingredients: [{ name: "Индейка", role: "protein" }], instructions: ["Сделайте фарш из грудки индейки", "Сформируйте котлеты и готовьте на пару 20 мин", "Подавайте со свежими овощами"], cookingTime: 25, mainIngredient: "индейка", isBudget: true },
      { name: "Горбуша в фольге", ingredients: [{ name: "Горбуша", role: "protein" }], instructions: ["Посолите и поперчите стейк горбуши", "Заверните плотно в фольгу", "Запекайте в духовке 15-20 минут"], cookingTime: 25, mainIngredient: "горбуша", isFish: true, isBudget: false },
      { name: "Белковый омлет", ingredients: [{ name: "Яйца", role: "protein" }], instructions: ["Используйте только белки яиц", "Взбейте и вылейте на антипригарную сковороду", "Готовьте под крышкой 3 минуты"], cookingTime: 5, mainIngredient: "яйца", isBudget: true },
      { name: "Запеченный минтай с лимоном", ingredients: [{ name: "Минтай", role: "protein" }], instructions: ["Выложите филе минтая на противень", "Сверху положите дольки лимона", "Запекайте 20 минут до готовности"], cookingTime: 25, mainIngredient: "минтай", isFish: true, isBudget: true },
      { name: "Салат с тунцом и яйцом", ingredients: [{ name: "Тунец", role: "protein" }, { name: "Яйца", role: "fixed", fixedWeight: 50 }], instructions: ["Слейте масло из консервированного тунца", "Добавьте нарезанное вареное яйцо", "Перемешайте с листом салата"], cookingTime: 5, mainIngredient: "тунец", isFish: true, isBudget: false },
      { name: "Куриное филе в пергаменте", ingredients: [{ name: "Курица", role: "protein" }], instructions: ["Заверните филе в лист пергамента со специями", "Обжаривайте на сухой сковороде по 7 минут с каждой стороны", "Мясо получится очень сочным"], cookingTime: 15, mainIngredient: "курица", isBudget: true },
      { name: "Творог с зеленью и чесноком", ingredients: [{ name: "Творог", role: "protein" }], instructions: ["Мелко нарубите укроп и петрушку", "Смешайте с творогом и каплей чеснока", "Посолите по вкусу"], cookingTime: 5, mainIngredient: "творог", isBudget: true },
      { name: "Индейка с тушеной капустой", ingredients: [{ name: "Индейка", role: "protein" }, { name: "Капуста", role: "fixed", fixedWeight: 250 }], instructions: ["Мелко нашинкуйте капусту и начните тушить", "Добавьте кусочки индейки", "Томите вместе до мягкости мяса"], cookingTime: 35, mainIngredient: "индейка", isBudget: true },
      { name: "Стейк из горбуши с огурцом", ingredients: [{ name: "Горбуша", role: "protein" }, { name: "Огурец", role: "fixed", fixedWeight: 100 }], instructions: ["Быстро обжарьте горбушу на сильном огне", "Подавайте со свежим огурцом", "Рыба сохранит сочность внутри"], cookingTime: 15, mainIngredient: "горбуша", isFish: true, isBudget: false },
      { name: "Куриная грудка и свекла", ingredients: [{ name: "Курица", role: "protein" }, { name: "Свекла", role: "fixed", fixedWeight: 150 }], instructions: ["Отварите грудку и свеклу заранее", "Нарежьте всё кубиками", "Заправьте капелькой масла"], cookingTime: 10, mainIngredient: "курица", isBudget: true },
      { name: "Рыбные котлеты из минтая на пару", ingredients: [{ name: "Минтай", role: "protein" }], instructions: ["Сделайте фарш из минтая и лука", "Готовьте котлеты в пароварке 15-20 минут", "Подавайте с зеленью"], cookingTime: 30, mainIngredient: "минтай", isFish: true, isBudget: true },
      { name: "Творог с кефиром (легкий ужин)", ingredients: [{ name: "Творог", role: "protein" }, { name: "Кефир", role: "filler", defaultWeight: 200 }], instructions: ["В глубокой тарелке залейте творог кефиром", "Тщательно разотрите комочки", "Дайте постоять 5 минут перед едой"], cookingTime: 3, mainIngredient: "творог", isBudget: true },
      { name: "Куриная печень с яблоком", ingredients: [{ name: "Печень", role: "protein" }, { name: "Яблоко", role: "fixed", fixedWeight: 100 }], instructions: ["Обжарьте печень 5 минут", "Добавьте ломтики яблок и потушите еще 5 минут", "Яблоко придаст печени мягкость и аромат"], cookingTime: 15, mainIngredient: "печень", isBudget: true },
      { name: "Индейка запеченная в духовке", ingredients: [{ name: "Индейка", role: "protein" }], instructions: ["Целый кусок филе обмажьте специями", "Запекайте в рукаве 40 минут", "Остудите и нарежьте тонкими ломтиками"], cookingTime: 50, mainIngredient: "индейка", isBudget: true },
      { name: "Салат 'Щетка' с курицей", ingredients: [{ name: "Курица", role: "protein" }, { name: "Капуста", role: "fixed", fixedWeight: 100 }, { name: "Морковь", role: "fixed", fixedWeight: 50 }, { name: "Свекла", role: "fixed", fixedWeight: 50 }], instructions: ["Нарежьте готовую курицу", "Добавьте сырые тертые овощи", "Заправьте лимонным соком"], cookingTime: 15, mainIngredient: "курица", isBudget: true },
      { name: "Минтай с кабачками на сковороде", ingredients: [{ name: "Минтай", role: "protein" }, { name: "Кабачок", role: "fixed", fixedWeight: 200 }], instructions: ["Кусочки рыбы и кружочки кабачков выложите на сковороду", "Добавьте немного воды и специй", "Тушите 15 минут под крышкой"], cookingTime: 20, mainIngredient: "минтай", isFish: true, isBudget: true },
      { name: "Говядина отварная с огурцом", ingredients: [{ name: "Говядина", role: "protein" }, { name: "Огурец", role: "fixed", fixedWeight: 150 }], instructions: ["Отварите постную говядину до мягкости", "Подавайте со свежим хрустящим огурцом", "Идеальный белковый ужин"], cookingTime: 90, mainIngredient: "говядина", isBudget: false },
      { name: "Творожный крем с зеленью", ingredients: [{ name: "Творог", role: "protein" }, { name: "Кефир", role: "filler", defaultWeight: 50 }], instructions: ["Взбейте творог с кефиром и зеленью в блендере", "Добавьте щепотку соли", "Полученную массу можно есть просто так или с хлебцами"], cookingTime: 5, mainIngredient: "творог", isBudget: true },
      { name: "Индейка на гриле", ingredients: [{ name: "Индейка", role: "protein" }], instructions: ["Тонкие слайсы индейки быстро обжарьте на сковороде-гриль", "Без добавления масла", "Подавайте сразу горячими"], cookingTime: 10, mainIngredient: "индейка", isBudget: true },
      { name: "Минтай запеченный под белками", ingredients: [{ name: "Минтай", role: "protein" }, { name: "Яйца", role: "filler", defaultWeight: 50 }], instructions: ["Рыбу выложите в форму", "Залейте взбитыми белками", "Запекайте в духовке 15 минут"], cookingTime: 20, mainIngredient: "минтай", isFish: true, isBudget: true },
      { name: "Куриная грудка (сувид дома)", ingredients: [{ name: "Курица", role: "protein" }], instructions: ["Поместите филе в пакет, удалите воздух", "Варите в кастрюле при температуре 70 градусов 1 час", "Мясо будет невероятно нежным"], cookingTime: 70, mainIngredient: "курица", isBudget: true },
      { name: "Индейка запеченная в рукаве", ingredients: [{ name: "Индейка", role: "protein" }], instructions: ["Положите филе в рукав для запекания", "Добавьте специи и завяжите", "Запекайте 35 минут при 200 градусах"], cookingTime: 40, mainIngredient: "индейка", isBudget: true },
      { name: "Говядина с пряными травами", ingredients: [{ name: "Говядина", role: "protein" }], instructions: ["Натрите мясо травами и солью", "Заверните в фольгу", "Томите в духовке 1.5 часа на медленном огне"], cookingTime: 100, mainIngredient: "говядина", isBudget: false },
      { name: "Куриные рулетики с кабачком", ingredients: [{ name: "Курица", role: "protein" }, { name: "Кабачок", role: "fixed", fixedWeight: 100 }], instructions: ["Тонко отбейте филе курицы", "Вложите ломтик кабачка и сверните", "Запекайте в духовке 25 минут"], cookingTime: 35, mainIngredient: "курица", isBudget: true },
      { name: "Салат из индейки и помидоров", ingredients: [{ name: "Индейка", role: "protein" }, { name: "Помидор", role: "fixed", fixedWeight: 200 }], instructions: ["Нарежьте вареную индейку", "Добавьте крупные дольки помидоров", "Посыпьте сушеными травами"], cookingTime: 10, mainIngredient: "индейка", isBudget: true }
    ],
    snack: [
      { name: "Яблоко зеленое", ingredients: [{ name: "Яблоко", role: "fixed", fixedWeight: 200 }], instructions: ["Вымойте яблоко", "Нарежьте тонкими дольками", "Съешьте в качестве легкого перекуса"], cookingTime: 2, mainIngredient: "яблоко", isBudget: true },
      { name: "Кефир стакан", ingredients: [{ name: "Кефир", role: "fixed", fixedWeight: 250 }], instructions: ["Налейте свежий кефир в стакан", "Пейте медленно", "Отличный вариант для перекуса на бегу"], cookingTime: 1, mainIngredient: "кефир", isBudget: true },
      { name: "Творог 5% (перекус)", ingredients: [{ name: "Творог", role: "protein" }], instructions: ["Съешьте порцию натурального творога", "Можно запить водой или чаем", "Чистый белок для ваших мышц"], cookingTime: 2, mainIngredient: "творог", isBudget: true },
      { name: "Вареное яйцо", ingredients: [{ name: "Яйца", role: "fixed", fixedWeight: 50 }], instructions: ["Сварите яйцо вкрутую (10 мин)", "Охладите под проточной водой", "Очистите и посолите"], cookingTime: 12, mainIngredient: "яйца", isBudget: true },
      { name: "Грейпфрут", ingredients: [{ name: "Грейпфрут", role: "fixed", fixedWeight: 200 }], instructions: ["Разрежьте грейпфрут пополам", "Извлеките мякоть ложечкой", "Помогает ускорить метаболизм"], cookingTime: 5, mainIngredient: "грейпфрут", isBudget: false },
      { name: "Груша сезонная", ingredients: [{ name: "Груша", role: "fixed", fixedWeight: 200 }], instructions: ["Вымойте спелую грушу", "Ешьте целиком или кусочками", "Источник клетчатки"], cookingTime: 2, mainIngredient: "груша", isBudget: true },
      { name: "Банан (половинка)", ingredients: [{ name: "Банан", role: "fixed", fixedWeight: 100 }], instructions: ["Очистите банан", "Съешьте половину фрукта", "Быстрая энергия перед тренировкой"], cookingTime: 2, mainIngredient: "банан", isBudget: true },
      { name: "Морковные палочки", ingredients: [{ name: "Морковь", role: "fixed", fixedWeight: 200 }], instructions: ["Почистите свежую морковь", "Нарежьте длинными палочками", "Хрустите с удовольствием"], cookingTime: 5, mainIngredient: "морковь", isBudget: true },
      { name: "Огурец свежий", ingredients: [{ name: "Огурец", role: "fixed", fixedWeight: 200 }], instructions: ["Тщательно вымойте огурцы", "Ешьте целиком или нарезанными", "Минимум калорий, максимум свежести"], cookingTime: 2, mainIngredient: "огурец", isBudget: true },
      { name: "Хлебец цельнозерновой", ingredients: [{ name: "Хлебец", role: "fixed", fixedWeight: 30 }], instructions: ["Возьмите 2-3 хлебца", "Отличная замена печенью или булке", "Содержит сложные углеводы"], cookingTime: 1, mainIngredient: "хлебец", isBudget: true },
      { name: "Ряженка стакан", ingredients: [{ name: "Ряженка", role: "fixed", fixedWeight: 250 }], instructions: ["Налейте густую ряженку в стакан", "Наслаждайтесь мягким вкусом", "Полезно для пищеварения"], cookingTime: 1, mainIngredient: "ряженка", isBudget: true },
      { name: "Сыр адыгейский", ingredients: [{ name: "Сыр", role: "fixed", fixedWeight: 50 }], instructions: ["Отрежьте ломтик легкого сыра", "Ешьте медленно, смакуя вкус", "Хороший источник кальция"], cookingTime: 2, mainIngredient: "сыр", isBudget: false },
      { name: "Помидорки черри", ingredients: [{ name: "Помидор", role: "fixed", fixedWeight: 150 }], instructions: ["Помойте веточку помидорок черри", "Ешьте их целиком как закуску", "Содержат важные антиоксиданты"], cookingTime: 2, mainIngredient: "помидор", isBudget: true },
      { name: "Яблоко запеченное", ingredients: [{ name: "Яблоко", role: "fixed", fixedWeight: 200 }], instructions: ["У яблока удалите сердцевину", "Поставьте в микроволновку на 3 минуты", "Полезный десерт без сахара"], cookingTime: 5, mainIngredient: "яблоко", isBudget: true },
      { name: "Йогурт натуральный", ingredients: [{ name: "Йогурт", role: "fixed", fixedWeight: 150 }], instructions: ["Откройте баночку натурального йогурта без добавок", "Ешьте ложкой", "Источник пробиотиков"], cookingTime: 1, mainIngredient: "йогурт", isBudget: true },
      { name: "Белок двух яиц", ingredients: [{ name: "Яйца", role: "protein" }], instructions: ["Сварите яйца и используйте только белки", "Можно нарезать и посыпать зеленью", "Чистый протеин без жира"], cookingTime: 12, mainIngredient: "яйца", isBudget: true },
      { name: "Томатный сок стакан", ingredients: [{ name: "Томатный сок", role: "fixed", fixedWeight: 250 }], instructions: ["Налейте томатный сок в высокий стакан", "Можно добавить щепотку соли или перца", "Утоляет голод и жажду"], cookingTime: 1, mainIngredient: "томатный сок", isBudget: true },
      { name: "Творог с яблоком (мини)", ingredients: [{ name: "Творог", role: "protein" }, { name: "Яблоко", role: "fixed", fixedWeight: 50 }], instructions: ["Смешайте ложку творога с мелко нарезанным яблоком", "Перемешайте и ешьте", "Сытный и легкий перекус"], cookingTime: 3, mainIngredient: "творог", isBudget: true },
      { name: "Кусочек индейки (холодный)", ingredients: [{ name: "Индейка", role: "protein" }], instructions: ["Возьмите ломтик заранее отваренной или запеченной индейки", "Ешьте просто так", "Отличная замена колбасе"], cookingTime: 1, mainIngredient: "индейка", isBudget: true },
      { name: "Салат из тертой свеклы (мини)", ingredients: [{ name: "Свекла", role: "fixed", fixedWeight: 150 }], instructions: ["Натрите вареную свеклу на терке", "Добавьте каплю лимонного сока", "Полезно для крови"], cookingTime: 5, mainIngredient: "свекла", isBudget: true },
      { name: "Хлебец с творогом", ingredients: [{ name: "Хлебец", role: "fixed", fixedWeight: 15 }, { name: "Творог", role: "protein" }], instructions: ["Намажьте творог на цельнозерновой хлебец", "Сверху можно положить ломтик огурца", "Вкусно и полезно"], cookingTime: 3, mainIngredient: "творог", isBudget: true },
      { name: "Горсть отрубей", ingredients: [{ name: "Отруби", role: "fixed", fixedWeight: 20 }], instructions: ["Насыпьте в ладонь порцию хрустящих отрубей", "Ешьте, запивая большим количеством воды", "Помогает очистить организм"], cookingTime: 1, mainIngredient: "отруби", isBudget: true },
      { name: "Половинка грейпфрута с чаем", ingredients: [{ name: "Грейпфрут", role: "fixed", fixedWeight: 100 }, { name: "Чай", role: "filler", defaultWeight: 250 }], instructions: ["Заварите ароматный чай", "Ешьте грейпфрут небольшими кусочками", "Приятного аппетита!"], cookingTime: 5, mainIngredient: "грейпфрут", isBudget: false },
      { name: "Сыр адыгейский с хлебцем", ingredients: [{ name: "Сыр", role: "fixed", fixedWeight: 30 }, { name: "Хлебец", role: "fixed", fixedWeight: 15 }], instructions: ["Положите ломтик сыра на хлебец", "Можно прогреть в микроволновке 10 секунд", "Сыр станет мягким и вкусным"], cookingTime: 2, mainIngredient: "сыр", isBudget: false },
      { name: "Яблоко с чаем", ingredients: [{ name: "Яблоко", role: "fixed", fixedWeight: 150 }, { name: "Чай", role: "filler", defaultWeight: 250 }], instructions: ["Заварите ваш любимый чай", "Нарежьте яблоко тонкими слайсами", "Ешьте яблоко вприкуску с чаем"], cookingTime: 5, mainIngredient: "яблоко", isBudget: true }
    ]
  };

  const MEAL_TITLES = {
    breakfast: "Завтрак",
    lunch: "Обед",
    dinner: "Ужин",
    snack: "Перекус",
    snack1: "Перекус 1",
    snack2: "Перекус 2",
  };

  const respectsExclusions = (meal, exclusions) => {
    if (!exclusions || exclusions.length === 0) return true;
    
    // Извлекаем названия всех ингредиентов
    const ingredientsNames = Array.isArray(meal.ingredients) 
      ? meal.ingredients.map(i => i.name).join(" ") 
      : "";
      
    const haystack = `${meal.name} ${meal.mainIngredient || ""} ${ingredientsNames}`.toLowerCase();
    
    return exclusions.every((ex) => !haystack.includes(ex));
  };

  const openRecipeModal = (meal, category) => {
    modalCategory.textContent = MEAL_TITLES[category] || category.toUpperCase();
    modalName.textContent = meal.name;
    
    // Ingredients with calculated weights
    modalIngredients.innerHTML = "";
    const weightTitle = document.createElement("div");
    weightTitle.className = "mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest";
    weightTitle.textContent = "Рассчитано под ваши цели:";
    modalIngredients.appendChild(weightTitle);

    meal.calculatedIngredients.forEach(ing => {
      const li = document.createElement("li");
      li.className = "flex items-center gap-2 font-semibold text-slate-900";
      const weightDisplay = ing.weight ? `${ing.weight}${ing.unit}${ing.suffix || ""}` : "по вкусу";
      li.innerHTML = `
        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span>${ing.name}: ${weightDisplay}</span>
      `;
      modalIngredients.appendChild(li);
    });

    // Instructions
    modalRecipe.innerHTML = "";
    const steps = meal.instructions || ["Приготовьте блюдо обычным способом."];
    steps.forEach((step, idx) => {
      const div = document.createElement("div");
      div.className = "flex gap-3";
      div.innerHTML = `
        <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-100">${idx + 1}</span>
        <span>${step}</span>
      `;
      modalRecipe.appendChild(div);
    });

    // Macros
    modalKcal.textContent = meal.macros.calories;
    modalProt.textContent = meal.macros.proteinG + "г";
    modalCarb.textContent = meal.macros.carbsG + "г";
    modalFat.textContent = meal.macros.fatG + "г";

    recipeModal.classList.remove("hidden");
    setTimeout(() => recipeModal.classList.remove("opacity-0", "scale-95"), 10);
  };

  const closeRecipeModal = () => {
    recipeModal.classList.add("opacity-0", "scale-95");
    setTimeout(() => recipeModal.classList.add("hidden"), 300);
  };

  const openMacrosModal = () => {
    const n = appState.run.nutrition;
    editProteinInput.value = n.proteinG;
    editFatsInput.value = n.fatG;
    editCarbsInput.value = n.carbsG;
    updateEditCalories();
    editMacrosModal.classList.remove("hidden");
    setTimeout(() => editMacrosModal.classList.remove("opacity-0", "scale-95"), 10);
  };

  const closeMacrosModalFunc = () => {
    editMacrosModal.classList.add("opacity-0", "scale-95");
    setTimeout(() => editMacrosModal.classList.add("hidden"), 300);
  };

  const updateEditCalories = () => {
    const p = Number(editProteinInput.value) || 0;
    const f = Number(editFatsInput.value) || 0;
    const c = Number(editCarbsInput.value) || 0;
    const total = p * 4 + f * 9 + c * 4;
    editCaloriesDisplay.textContent = `${total} ккал`;
  };

  const saveManualMacros = () => {
    const p = Number(editProteinInput.value) || 0;
    const f = Number(editFatsInput.value) || 0;
    const c = Number(editCarbsInput.value) || 0;
    const cal = p * 4 + f * 9 + c * 4;

    const newNutrition = {
      calories: cal,
      proteinG: p,
      fatG: f,
      carbsG: c
    };

    appState.run.nutrition = newNutrition;
    appState.profile.manualNutrition = newNutrition; // Сохраняем в профиль как переопределение

    // ПЕРЕСЧЕТ ВСЕГО ПЛАНА
    const numMeals = appState.profile?.behavior?.meals || 4;
    const splits = getMealSplits(numMeals);

    Object.keys(appState.run.planByDate).forEach(date => {
      if (date === "personalNote") return;
      const dayPlan = appState.run.planByDate[date];
      Object.keys(dayPlan).forEach(cat => {
        const meal = dayPlan[cat];
        const pct = splits[cat] || 0.25;
        const targetMealMacros = {
          calories: Math.round(cal * pct),
          proteinG: Math.round(p * pct),
          carbsG: Math.round(c * pct),
          fatG: Math.round(f * pct),
        };
        // Обновляем макросы и граммовки
        meal.macros = targetMealMacros;
        // Находим оригинальный рецепт из библиотеки по имени (упрощенно)
        let baseRecipe = null;
        Object.values(MEAL_LIBRARY).some(list => {
          baseRecipe = list.find(r => r.name === meal.name);
          return !!baseRecipe;
        });

        if (baseRecipe) {
          meal.calculatedIngredients = calculateCustomPortion(baseRecipe, targetMealMacros);
        }
      });
    });

    saveStorage();
    renderDashboard();
    closeMacrosModalFunc();
    showToast("Цели БЖУ обновлены, порции пересчитаны", "success");
  };

  const calculateCustomPortion = (recipe, targetMacros) => {
    const gender = appState.profile.gender || "female";
    const grainLimit = gender === "male" ? 100 : 75; // Лимит для сухой крупы
    
    let result = [];
    let extraIngredients = [];
    let currentCarbsG = 0;

    recipe.ingredients.forEach(ing => {
      let weight = 0;
      let unit = "г";
      let suffix = "";
      const nameLower = ing.name.toLowerCase().trim();
      let data = INGREDIENT_DATA[nameLower];
      
      if (!data) {
        console.warn(`Missing data for [${ing.name}]`);
        data = { p: 10, f: 5, c: 20, cal: 150, type: "other" }; 
      }

      if (ing.role === "protein") {
        weight = Math.round((targetMacros.proteinG / data.p) * 100);
        if (["meat", "fish", "egg"].includes(data.type)) suffix = " (сырой вес)";
      } else if (ing.role === "carbs") {
        weight = Math.round((targetMacros.carbsG / data.c) * 100);
        if (data.type === "grain") {
          suffix = " (сухой вес)";
          if (weight > grainLimit) {
            weight = grainLimit;
          }
        }
      } else if (ing.role === "fixed") {
        weight = ing.fixedWeight || 200;
      } else if (ing.role === "calories") {
        weight = Math.round((targetMacros.calories / data.cal) * 100);
      } else if (ing.role === "filler") {
        weight = ing.defaultWeight || 0;
      }

      // Лимиты здравого смысла
      if (weight > 600) weight = 100;
      if (data.type === "fruit" || data.type === "veg") weight = Math.min(weight, 300);
      if (data.type === "liquid") { weight = Math.min(weight, 500); unit = "мл"; }
      if (nameLower === "вода" || nameLower === "чай") { unit = "мл"; if (weight === 0) weight = 250; }

      currentCarbsG += (weight * data.c) / 100;

      result.push({
        name: ing.name,
        weight: weight > 0 ? weight : null,
        unit: weight > 0 ? unit : "",
        suffix
      });
    });

    // Добор углеводов овощами/фруктами
    let remainingCarbs = targetMacros.carbsG - currentCarbsG;
    if (remainingCarbs > 3) {
      // 1. Овощной добор (100-150г)
      const vegWeight = 150;
      const vegCarbs = (vegWeight * 5) / 100; // среднее 5г углей на 100г овощей
      extraIngredients.push({
        name: "Овощи (капуста/кабачок/огурец) для объема",
        weight: vegWeight,
        unit: "г",
        suffix: ""
      });
      remainingCarbs -= vegCarbs;

      // 2. Если все еще мало, добавляем фрукт
      if (remainingCarbs > 5) {
        extraIngredients.push({
          name: "Яблоко (десерт)",
          weight: 100,
          unit: "г",
          suffix: ""
        });
      }
    }

    return [...result, ...extraIngredients];
  };

  const getRecentHistory = (daysBack = 5) => {
    const history = { dishes: new Set(), ingredients: new Set(), fishCount: 0, meatCount: 0, legumeCount: 0 };
    if (!appState.run || !appState.run.planByDate) return history;

    const dates = Object.keys(appState.run.planByDate)
      .filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k))
      .sort()
      .reverse();
    const recentDates = dates.slice(0, daysBack);
    const weekDates = dates.slice(0, 7);

    recentDates.forEach(date => {
      const dayPlan = appState.run.planByDate[date];
      if (!dayPlan || typeof dayPlan !== "object") return;
      Object.values(dayPlan).forEach(meal => {
        if (!meal || typeof meal !== "object") return;
        history.dishes.add(meal.name);
        if (meal.mainIngredient) history.ingredients.add(meal.mainIngredient);
      });
    });

    const meatIngredients = ["курица", "индейка", "говядина", "печень", "сердечки"];

    const legumeKeywords = ["фасол", "нут", "чечев", "горох"];

    weekDates.forEach(date => {
      const dayPlan = appState.run.planByDate[date];
      if (!dayPlan || typeof dayPlan !== "object") return;
      Object.values(dayPlan).forEach(meal => {
        if (!meal || typeof meal !== "object") return;
        if (meal.isFish) history.fishCount++;
        if (meal.mainIngredient && meatIngredients.includes(meal.mainIngredient.toLowerCase())) {
          history.meatCount++;
        }

        const mealText = `${meal.name || ""} ${(meal.ingredientsWithWeights || []).join(" ")}`.toLowerCase();
        const calcText = Array.isArray(meal.calculatedIngredients)
          ? meal.calculatedIngredients.map(i => i.name).join(" ").toLowerCase()
          : "";
        const txt = `${mealText} ${calcText}`;
        if (legumeKeywords.some(k => txt.includes(k))) history.legumeCount++;
      });
    });

    return history;
  };

  const respectsEquipment = (meal, equipment) => {
    const eq = equipment || "any";
    if (eq === "any") return true;
    const txt = `${meal.name || ""} ${(meal.instructions || []).join(" ")}`.toLowerCase();
    const ovenKeywords = ["духов", "запек", "противен", "фольг", "рукав", "выпек", "запекан"]; 

    if (eq === "no_oven" || eq === "stovetop_only") {
      return !ovenKeywords.some(k => txt.includes(k));
    }

    if (eq === "microwave_only") {
      const micro = ["микроволн", "свч"];
      return micro.some(k => txt.includes(k));
    }

    return true;
  };

  const respectsPrep = (meal, hasPrep) => {
    if (hasPrep) return true;
    if (meal?.requiresPrep) return false;
    return true;
  };

  const respectsHealth = (meal, profile) => {
    const chronic = profile?.health?.chronic || "none";
    const digestion = String(profile?.health?.digestion || "").toLowerCase();
    const txt = `${meal.name || ""} ${(meal.instructions || []).join(" ")}`.toLowerCase();

    if (chronic === "diabetes") {
      const avoid = ["манка", "батон", "гренк", "банан", "сок"]; 
      if (avoid.some(k => txt.includes(k))) return false;
    }

    if (chronic === "gastro" || digestion.length > 0) {
      const avoid = ["обжар", "жар", "карри", "остр", "копчен"]; 
      if (avoid.some(k => txt.includes(k))) return false;
    }

    return true;
  };

  const pickMeal = (category, exclusions, dayIndex) => {
    let libCat = category;
    if (category === "snack1" || category === "snack2") libCat = "snack";
    const list = MEAL_LIBRARY[libCat] || [];
    const history = getRecentHistory(5);
    const cookTimeLimit = appState.profile?.maxCookingTime || 999;
    const equipment = appState.profile?.equipment || "any";
    const hasPrep = !!appState.profile?.hasPrep;
    const inventory = appState.profile?.behavior?.inventory || [];
    
    // Фильтруем по исключениям, правилу 5 дней и времени готовки
    let possible = list.filter(m => {
      const exc = respectsExclusions(m, exclusions);
      const rep = !history.dishes.has(m.name) && !history.ingredients.has(m.mainIngredient);
      const timeOk = (m.cookingTime || 15) <= cookTimeLimit;
      const eqOk = respectsEquipment(m, equipment);
      const prepOk = respectsPrep(m, hasPrep);
      const healthOk = respectsHealth(m, appState.profile);
      return exc && rep && timeOk && eqOk && prepOk && healthOk;
    });

    // ПРИОРИТЕТ: Продукты в наличии
    if (inventory.length > 0) {
      const inventoryPossible = possible.filter(m => {
        const txt = `${m.name} ${m.mainIngredient || ""}`.toLowerCase();
        return inventory.some(item => txt.includes(item));
      });
      if (inventoryPossible.length > 0) {
        possible = inventoryPossible;
      }
    }

    if (possible.length === 0) {
      possible = list.filter(m => {
        const exc = respectsExclusions(m, exclusions);
        const timeOk = (m.cookingTime || 15) <= cookTimeLimit;
        const eqOk = respectsEquipment(m, equipment);
        const prepOk = respectsPrep(m, hasPrep);
        const healthOk = respectsHealth(m, appState.profile);
        return exc && timeOk && eqOk && prepOk && healthOk;
      });
    }

    if (possible.length === 0) {
      possible = list.filter(m => {
        const exc = respectsExclusions(m, exclusions);
        const timeOk = (m.cookingTime || 15) <= cookTimeLimit;
        const eqOk = respectsEquipment(m, equipment);
        const prepOk = respectsPrep(m, hasPrep);
        return exc && timeOk && eqOk && prepOk;
      });
    }

    if (possible.length === 0) {
      possible = list.filter(m => respectsExclusions(m, exclusions));
    }

    const isMainMeal = (category === "lunch" || category === "dinner");
    const meatIngredients = ["курица", "индейка", "говядина", "печень", "сердечки"];

    // 1. Лимит на рыбу: не более 3 раз в неделю
    if (isMainMeal && history.fishCount >= 3) {
      const noFish = possible.filter(m => !m.isFish);
      if (noFish.length > 0) possible = noFish;
    }

    // 2. Мясная квота: минимум 4 дня в неделю мясо/птица
    if (isMainMeal && history.meatCount < 4) {
      const meatOptions = possible.filter(m => 
        m.mainIngredient && meatIngredients.includes(m.mainIngredient.toLowerCase())
      );
      if (meatOptions.length > 0) possible = meatOptions;
    }

    // 3. Бобовые: минимум 2 раза в неделю (если есть варианты)
    if (isMainMeal && history.legumeCount < 2) {
      const legumeOptions = possible.filter((m) => {
        const ingText = Array.isArray(m.ingredients) ? m.ingredients.map(i => i.name).join(" ") : "";
        const txt = `${m.name || ""} ${ingText}`.toLowerCase();
        return ["фасол", "нут", "чечев", "горох"].some(k => txt.includes(k));
      });
      if (legumeOptions.length > 0) possible = legumeOptions;
    }

    // Повышаем шанс рыбы, если ее мало (< 2), но лимит (3) позволяет
    if (isMainMeal && history.fishCount < 2) {
      const fishOptions = possible.filter(m => m.isFish);
      if (fishOptions.length > 0) return fishOptions[Math.floor(Math.random() * fishOptions.length)];
    }

    const meal = possible.length > 0
      ? possible[Math.floor(Math.random() * possible.length)]
      : list[0];

    return meal;
  };

  const getMealCategories = (numMeals) => {
    if (numMeals === 2) return ["breakfast", "dinner"];
    if (numMeals === 3) return ["breakfast", "lunch", "dinner"];
    if (numMeals === 5) return ["breakfast", "snack1", "lunch", "snack2", "dinner"];
    return ["breakfast", "lunch", "dinner", "snack"]; // 4 по умолчанию
  };

  const getMealSplits = (numMeals) => {
    if (numMeals === 2) return { breakfast: 0.5, dinner: 0.5 };
    if (numMeals === 3) return { breakfast: 0.3, lunch: 0.4, dinner: 0.3 };
    if (numMeals === 5) return { breakfast: 0.2, snack1: 0.1, lunch: 0.3, snack2: 0.1, dinner: 0.3 };
    return { breakfast: 0.25, lunch: 0.35, dinner: 0.25, snack: 0.15 }; // 4 по умолчанию
  };

  const buildPlanForDay = (nutrition, exclusions, dayIndex = 0) => {
    const numMeals = appState.profile?.behavior?.meals || 4;
    const categories = getMealCategories(numMeals);
    const splits = getMealSplits(numMeals);

    const makeMeal = (category) => {
      const base = pickMeal(category, exclusions, dayIndex);
      const pct = splits[category] || 0.25;
      
      const targetMacros = {
        calories: Math.round(nutrition.calories * pct),
        proteinG: Math.round(nutrition.proteinG * pct),
        carbsG: Math.round(nutrition.carbsG * pct),
        fatG: Math.round(nutrition.fatG * pct),
      };

      const calculatedIngredients = calculateCustomPortion(base, targetMacros);

      return {
        category,
        title: MEAL_TITLES[category] || category,
        name: base.name,
        mainIngredient: base.mainIngredient,
        isFish: base.isFish || false,
        isBudget: base.isBudget || false,
        cookingTime: base.cookingTime || 15,
        instructions: base.instructions,
        calculatedIngredients,
        macros: targetMacros,
      };
    };

    const dayPlan = {};
    categories.forEach(cat => {
      dayPlan[cat] = makeMeal(cat);
    });
    return dayPlan;
  };

  const ensureDayData = (run, isoDate) => {
    if (!run.days[isoDate]) {
      const plan = run.planByDate[isoDate] || {};
      const eaten = {};
      Object.keys(plan).forEach(cat => {
        if (cat !== "personalNote") eaten[cat] = false;
      });

      run.days[isoDate] = {
        steps: 0,
        weight: null,
        checkin: {
          waterMl: 0,
          hunger: 5,
          energy: 5,
          cravings: 5,
          digestion: 5,
        },
        eaten: eaten,
      };
    }

    if (!run.days[isoDate].checkin) {
      run.days[isoDate].checkin = { waterMl: 0, hunger: 5, energy: 5, cravings: 5, digestion: 5 };
    }

    return run.days[isoDate];
  };

  const currentTodayISO = () => toLocalISODate(new Date());

  const runInfo = () => {
    const start = appState.run.startDate;
    const today = currentTodayISO();
    const idx = diffDays(start, today);
    const todayIndex = clamp(idx, 0, appState.run.durationDays - 1);
    return {
      start,
      today,
      todayIndex,
    };
  };

  const isDayLocked = (dayIndex) => {
    const { todayIndex } = runInfo();
    return dayIndex > todayIndex;
  };

  const isEditingAllowedForISO = (isoDate) => {
    const { today } = runInfo();
    return isoDate === today;
  };

  const computeDaySuccess = (isoDate) => {
    const day = ensureDayData(appState.run, isoDate);
    const plan = appState.run.planByDate[isoDate] || {};
    const mealKeys = Object.keys(plan).filter(k => k !== "personalNote");
    const allMeals = mealKeys.every(k => !!day.eaten[k]);
    const stepsOk = (day.steps || 0) >= STEPS_GOAL;
    return allMeals && stepsOk;
  };

  const renderCalendar = () => {
    calendarStrip.innerHTML = "";

    // Добавляем поддержку прокрутки колесиком мыши для ПК
    if (!calendarStrip.dataset.eventsBound) {
      // 1. Колесико мыши
      calendarStrip.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        calendarStrip.scrollLeft += evt.deltaY;
      }, { passive: false });

      // 2. Перетаскивание мышкой (Drag-to-scroll)
      let isDown = false;
      let startX;
      let scrollLeft;

      calendarStrip.addEventListener("mousedown", (e) => {
        isDown = true;
        calendarStrip.classList.add("cursor-grabbing");
        calendarStrip.classList.remove("cursor-grab");
        startX = e.pageX - calendarStrip.offsetLeft;
        scrollLeft = calendarStrip.scrollLeft;
      });

      calendarStrip.addEventListener("mouseleave", () => {
        isDown = false;
        calendarStrip.classList.remove("cursor-grabbing");
      });

      calendarStrip.addEventListener("mouseup", () => {
        isDown = false;
        calendarStrip.classList.remove("cursor-grabbing");
      });

      calendarStrip.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - calendarStrip.offsetLeft;
        const walk = (x - startX) * 2; // Множитель скорости прокрутки
        calendarStrip.scrollLeft = scrollLeft - walk;
      });

      calendarStrip.classList.add("cursor-grab");
      calendarStrip.dataset.eventsBound = "true";
    }

    const { start, todayIndex } = runInfo();
    const duration = appState.run.durationDays;

    for (let i = 0; i < duration; i += 1) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const iso = toLocalISODate(date);

      const isSelected = appState.selectedDate === iso;
      const past = i < todayIndex;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.iso = iso;

      const dayLabel = date.toLocaleDateString("ru-RU", { month: "short", day: "numeric" });

      let base =
        "shrink-0 rounded-[1.2rem] px-3 py-3 text-sm font-semibold ring-1 transition min-w-[70px] " +
        (isSelected ? "ring-emerald-400 bg-emerald-50 text-emerald-900" : "ring-slate-200 bg-white text-slate-700 hover:bg-slate-50");

      if (past && !isSelected) {
        const ok = computeDaySuccess(iso);
        base = ok
          ? "shrink-0 rounded-[1.2rem] px-3 py-3 text-sm font-semibold ring-1 transition min-w-[70px] bg-emerald-50 text-emerald-800 ring-emerald-200"
          : "shrink-0 rounded-[1.2rem] px-3 py-3 text-sm font-semibold ring-1 transition min-w-[70px] bg-rose-50 text-rose-700 ring-rose-200";
      }

      btn.className = base;
      btn.textContent = dayLabel;

      btn.addEventListener("click", () => {
        appState.selectedDate = iso;
        saveStorage();
        renderDashboard();
      });

      calendarStrip.appendChild(btn);

      if (isSelected) {
        setTimeout(() => {
          btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }, 100);
      }
    }
    calendarStrip.classList.add("scrollbar-hide");
  };

  const setStepsRing = (steps) => {
    const radius = 50;
    const circ = 2 * Math.PI * radius;
    const pct = clamp(steps / STEPS_GOAL, 0, 1);
    const offset = circ * (1 - pct);
    stepsRing.setAttribute("stroke-dasharray", String(Math.round(circ)));
    stepsRing.setAttribute("stroke-dashoffset", String(offset));
  };

  const renderSteps = () => {
    const iso = appState.selectedDate;
    const day = ensureDayData(appState.run, iso);

    if (stepsValue) stepsValue.textContent = String(day.steps || 0);
    if (stepsInput) stepsInput.value = String(day.steps || 0);
    setStepsRing(day.steps || 0);

    if (weightInputToday) weightInputToday.value = day.weight || "";

    const editable = isEditingAllowedForISO(iso);
    if (stepsInput) {
      stepsInput.disabled = !editable;
      stepsInput.classList.toggle("opacity-60", !editable);
    }
    if (weightInputToday) weightInputToday.disabled = !editable;
  };

  const showToast = (message, type = "success") => {
    // Удаляем старые уведомления, чтобы они не накладывались
    document.querySelectorAll(".gh-toast").forEach(t => t.remove());

    const toast = document.createElement("div");
    toast.className = `gh-toast fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl transition-all duration-300 transform translate-y-20 opacity-0 flex items-center gap-3 ${
      type === "success" ? "bg-emerald-900 text-white" : "bg-sky-900 text-white"
    }`;
    
    const icon = type === "success" 
      ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>'
      : '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>';
    
    toast.innerHTML = `${icon}<span>${message}</span>`;
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-20", "opacity-0");
    });
    
    setTimeout(() => {
      toast.classList.add("translate-y-20", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  const smartReplaceMeal = async (date, category, cardEl) => {
    const list = MEAL_LIBRARY[category] || [];
    const exclusions = appState.profile.exclusionsNormalized || [];
    const history = getRecentHistory(5);
    const currentMeal = appState.run.planByDate[date][category];

    // Шаг 1: Локальный поиск
    const cookTimeLimit = appState.profile?.maxCookingTime || 999;
    const equipment = appState.profile?.equipment || "any";
    const hasPrep = !!appState.profile?.hasPrep;
    let possible = list.filter(m => {
      const isExcluded = !respectsExclusions(m, exclusions);
      const isRepeated = history.dishes.has(m.name) || (m.mainIngredient && history.ingredients.has(m.mainIngredient));
      const isCurrent = m.name === currentMeal.name;
      const isTooLong = (m.cookingTime || 15) > cookTimeLimit;
      const eqOk = respectsEquipment(m, equipment);
      const prepOk = respectsPrep(m, hasPrep);
      const healthOk = respectsHealth(m, appState.profile);
      return !isExcluded && !isRepeated && !isCurrent && !isTooLong && eqOk && prepOk && healthOk;
    });

    if (possible.length > 0) {
      const nutrition = appState.run.nutrition;
      const numMeals = appState.profile?.behavior?.meals || 4;
      const splits = getMealSplits(numMeals);
      const pct = splits[category] || 0.25;
      const targetMacros = {
        calories: Math.round(nutrition.calories * pct),
        proteinG: Math.round(nutrition.proteinG * pct),
        carbsG: Math.round(nutrition.carbsG * pct),
        fatG: Math.round(nutrition.fatG * pct),
      };

      const selected = possible[Math.floor(Math.random() * possible.length)];
      const newMeal = {
        ...selected,
        calculatedIngredients: calculateCustomPortion(selected, targetMacros),
        macros: targetMacros
      };

      appState.run.planByDate[date][category] = newMeal;
      saveStorage();
      renderDashboard();
      showToast("Блюдо заменено из библиотеки");
    } else {
      // Шаг 2: Fallback на ИИ
      replaceMealWithAI(date, category, cardEl);
    }
  };

  const replaceMealWithAI = async (date, category, cardEl) => {
    const performLocalSmartReplacement = () => {
      const list = MEAL_LIBRARY[category] || [];
      const exclusions = appState.profile.exclusionsNormalized || [];
      const history = getRecentHistory(5);
      const currentMeal = appState.run.planByDate[date][category];
      const cookTimeLimit = appState.profile?.maxCookingTime || 999;
      const equipment = appState.profile?.equipment || "any";
      const hasPrep = !!appState.profile?.hasPrep;

      let possible = list.filter((m) => {
        if (!respectsExclusions(m, exclusions)) return false;
        if (!respectsEquipment(m, equipment)) return false;
        if (!respectsPrep(m, hasPrep)) return false;
        if (!respectsHealth(m, appState.profile)) return false;
        if ((m.cookingTime || 15) > cookTimeLimit) return false;
        if (m.name === currentMeal?.name) return false;
        if (history.dishes.has(m.name)) return false;
        if (m.mainIngredient && history.ingredients.has(m.mainIngredient)) return false;
        return true;
      });

      if (possible.length === 0) {
        possible = list.filter((m) => {
          if (!respectsExclusions(m, exclusions)) return false;
          if (!respectsEquipment(m, equipment)) return false;
          if (!respectsPrep(m, hasPrep)) return false;
          if ((m.cookingTime || 15) > cookTimeLimit) return false;
          if (m.name === currentMeal?.name) return false;
          return true;
        });
      }

      if (possible.length === 0) return false;

      const selected = possible[Math.floor(Math.random() * possible.length)];
      const targetMacros = currentMeal?.macros || (() => {
        const nutrition = appState.run.nutrition;
        const numMeals = appState.profile?.behavior?.meals || 4;
        const splits = getMealSplits(numMeals);
        const pct = splits[category] || 0.25;
        return {
          calories: Math.round(nutrition.calories * pct),
          proteinG: Math.round(nutrition.proteinG * pct),
          carbsG: Math.round(nutrition.carbsG * pct),
          fatG: Math.round(nutrition.fatG * pct),
        };
      })();

      const newMeal = {
        category,
        title: MEAL_TITLES[category] || category,
        name: selected.name,
        mainIngredient: selected.mainIngredient,
        isFish: selected.isFish || false,
        isBudget: selected.isBudget || false,
        cookingTime: selected.cookingTime || 15,
        instructions: selected.instructions,
        calculatedIngredients: calculateCustomPortion(selected, targetMacros),
        macros: targetMacros,
      };

      appState.run.planByDate[date][category] = newMeal;
      saveStorage();
      renderDashboard();
      return true;
    };

    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("AIzaSyCoc86_dpfX8iKVzr-PCoiO-99tyx4-LMA")) {
      showToast("Используем локальную замену...", "ai");
      performLocalSmartReplacement();
      return;
    }

    const currentMeal = appState.run.planByDate[date][category];
    const exclusions = appState.profile.exclusionsDisplay || [];

    const originalContent = cardEl.innerHTML;
    cardEl.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 space-y-4">
        <div class="h-8 w-8 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500"></div>
        <div class="text-sm font-medium text-slate-500 animate-pulse">Заменяем блюдо...</div>
      </div>
    `;

    const prompt = `
      Замени блюдо "${currentMeal.name}" в категории "${category}". 
      ПРОДУКТЫ ДОЛЖНЫ БЫТЬ ПРОСТЫМИ И ДОСТУПНЫМИ.
      Целевые параметры: ${currentMeal.macros.calories} ккал, Б: ${currentMeal.macros.proteinG}г, У: ${currentMeal.macros.carbsG}г, Ж: ${currentMeal.macros.fatG}г.
      Учти исключения пользователя: ${exclusions.join(", ")}.
      
      ДАННЫЕ ПОЛЬЗОВАТЕЛЯ:
      Здоровье: ${appState.profile.health?.chronic || "норма"}, Стресс: ${appState.profile.lifestyle?.stress || "5"}/10, Сон: ${appState.profile.lifestyle?.sleep || "норма"}.
      Если у пользователя высокий стресс или плохой сон, подбери соответствующее блюдо.
      Время приготовления не должно превышать ${appState.profile.maxCookingTime || 30} минут.
      Оборудование: ${appState.profile.equipment || "any"}. Если выбрано "Без духовки" — не используй духовку.
      Заготовки: ${appState.profile.hasPrep ? "есть" : "нет"}. Если заготовок нет — избегай рецептов с явной долгой варкой/запеканием.
      Если диабет — избегай сладких напитков/соков и явных быстрых углеводов.
      Если ЖКТ/есть жалобы — меньше жареного/острого, больше тушёного/варёного.
      Цели качества: добавь овощи/фрукты и клетчатку (овощи, бобовые), избегай лишнего сахара.

      SAFETY: Если отмечены флаги (беременность/ГВ, РПП, почки, подагра) — избегай экстремальных ограничений и добавь максимально мягкое, безопасное блюдо.

      Верни СТРОГО один JSON-объект блюда с полями:
      "name" (строка), 
      "ingredientsWithWeights" (массив строк с граммовкой), 
      "macros" (объект: calories, proteinG, carbsG, fatG),
      "instructions" (массив строк с шагами).
      Только русский язык. Только чистый JSON без markdown.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    try {
      showToast("Gemini готовит новый рецепт...", "ai");
      console.log("Отправка запроса по адресу:", url);
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Full error response from Google:", errorData);
        throw new Error("API Offline");
      }

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      const newMeal = JSON.parse(cleanJson);

      appState.run.planByDate[date][category] = newMeal;
      saveStorage();
      renderDashboard();
      showToast("Готово: блюдо обновлено ИИ", "success");
    } catch (err) {
      console.warn("API Error, falling back to library:", err);
      cardEl.innerHTML = originalContent; 
      const ok = performLocalSmartReplacement();
      if (ok) {
        showToast("Заменено из библиотеки (ИИ недоступен)", "success");
      } else {
        showToast("Нет подходящих блюд в базе", "success");
      }
      renderDashboard(); 
    }
  };

  const renderMeals = () => {
    const iso = appState.selectedDate;
    const day = ensureDayData(appState.run, iso);
    const editable = isEditingAllowedForISO(iso);
    
    const { todayIndex } = runInfo();
    const selectedIndex = diffDays(appState.run.startDate, iso);
    const isFutureOrToday = selectedIndex >= todayIndex;

    const plan = appState.run.planByDate[iso] || appState.run.planByDate[appState.run.startDate];
    const categories = Object.keys(plan).filter(k => k !== "personalNote");

    mealCards.innerHTML = "";

    categories.forEach((cat) => {
      const meal = plan[cat];
      const eaten = !!day.eaten[cat];

      const card = document.createElement("div");
      card.className =
        "rounded-[2rem] p-5 ring-1 transition-all duration-300 relative overflow-hidden cursor-pointer " +
        (eaten ? "bg-emerald-50/30 ring-emerald-100 opacity-60 grayscale-[0.8]" : "bg-white ring-slate-200 shadow-sm hover:shadow-md");

      const top = document.createElement("div");
      top.className = "flex items-start justify-between gap-3";

      const left = document.createElement("div");
      left.className = "flex-1";

      const badgeRow = document.createElement("div");
      badgeRow.className = "flex flex-wrap gap-1.5 mb-1";
      
      const title = document.createElement("span");
      title.className = "text-[10px] font-bold uppercase tracking-wider " + (eaten ? "text-emerald-600" : "text-slate-400");
      title.textContent = MEAL_TITLES[cat] || cat.toUpperCase();
      badgeRow.appendChild(title);

      // Теги [Бюджетно] и [Быстро]
      if (meal.isBudget) {
        const budgetTag = document.createElement("span");
        budgetTag.className = "text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 ring-1 ring-amber-100 uppercase";
        budgetTag.textContent = "Бюджетно";
        badgeRow.appendChild(budgetTag);
      }

      if (meal.cookingTime < 15) {
        const fastTag = document.createElement("span");
        fastTag.className = "text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-600 ring-1 ring-sky-100 uppercase";
        fastTag.textContent = "Быстро";
        badgeRow.appendChild(fastTag);
      }

      const name = document.createElement("div");
      name.className = "mt-1 text-lg font-semibold text-slate-900 leading-tight " + (eaten ? "line-through opacity-60" : "");
      name.textContent = meal.name;

      const mainIngred = document.createElement("div");
      mainIngred.className = "mt-1 text-xs font-medium text-slate-500 " + (eaten ? "opacity-50" : "");
      
      // Находим основной ингредиент (обычно первый или помеченный ролью)
      const main = meal.calculatedIngredients?.[0];
      const weightText = main ? ` (${main.weight}${main.unit}${main.suffix || ""})` : "";
      mainIngred.textContent = `Основа: ${meal.mainIngredient || "блюдо"}${weightText}`;

      left.appendChild(badgeRow);
      left.appendChild(name);
      left.appendChild(mainIngred);

      const right = document.createElement("div");
      right.className = "flex flex-col items-end gap-3";

      const checkBtn = document.createElement("button");
      checkBtn.type = "button";
      checkBtn.disabled = !editable;
      checkBtn.className = `group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
        eaten 
        ? "bg-emerald-500 text-white shadow-emerald-200 shadow-lg" 
        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
      } ${!editable ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`;

      checkBtn.innerHTML = eaten 
        ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-0 group-hover:opacity-100" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>`;

      const macroPill = document.createElement("div");
      macroPill.className = `rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
        eaten ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
      }`;
      macroPill.textContent = `${meal.macros.calories} ккал`;

      right.appendChild(checkBtn);
      right.appendChild(macroPill);

      top.appendChild(left);
      top.appendChild(right);

      const bottom = document.createElement("div");
      bottom.className = "mt-4 flex items-center justify-between";
      
      const macroStats = document.createElement("div");
      macroStats.className = "flex gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400";
      macroStats.innerHTML = `
        <span class="${eaten ? "text-emerald-600/60" : ""}">Б ${meal.macros.proteinG}г</span>
        <span class="${eaten ? "text-emerald-600/60" : ""}">У ${meal.macros.carbsG}г</span>
        <span class="${eaten ? "text-emerald-600/60" : ""}">Ж ${meal.macros.fatG}г</span>
      `;

      bottom.appendChild(macroStats);

      if (isFutureOrToday && !eaten) {
        const actionGroup = document.createElement("div");
        actionGroup.className = "flex gap-2";

        // Кнопка локальной замены (Shuffle)
        const shuffleBtn = document.createElement("button");
        shuffleBtn.type = "button";
        shuffleBtn.className = "flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-emerald-500 hover:text-white active:scale-90 shadow-sm";
        shuffleBtn.title = "Заменить из библиотеки (быстро)";
        shuffleBtn.innerHTML = `
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        `;
        shuffleBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          smartReplaceMeal(iso, cat, card);
        });

        // Кнопка ИИ замены
        const aiBtn = document.createElement("button");
        aiBtn.type = "button";
        aiBtn.className = "flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white transition hover:bg-emerald-600 active:scale-90 shadow-sm";
        aiBtn.title = "Сгенерировать новое через ИИ (Gemini)";
        aiBtn.innerHTML = `
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        `;
        aiBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          replaceMealWithAI(iso, cat, card);
        });

        actionGroup.appendChild(shuffleBtn);
        actionGroup.appendChild(aiBtn);
        bottom.appendChild(actionGroup);
      }

      checkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!editable) return;
        day.eaten[cat] = !eaten;
        saveStorage();
        renderDashboard();
      });

      card.addEventListener("click", () => {
        openRecipeModal(meal, cat);
      });

      card.appendChild(top);
      card.appendChild(bottom);
      mealCards.appendChild(card);
    });
  };

  const computeConsumed = () => {
    const iso = appState.selectedDate;
    const day = ensureDayData(appState.run, iso);
    const plan = appState.run.planByDate[iso] || appState.run.planByDate[appState.run.startDate];

    let calories = 0;
    let proteinG = 0;
    let carbsG = 0;
    let fatG = 0;

    Object.entries(day.eaten).forEach(([cat, eaten]) => {
      if (!eaten) return;
      const meal = plan[cat];
      calories += meal.macros.calories;
      proteinG += meal.macros.proteinG;
      carbsG += meal.macros.carbsG;
      fatG += meal.macros.fatG;
    });

    return { calories, proteinG, carbsG, fatG };
  };

  const setBar = (barEl, pct) => {
    const p = clamp(pct, 0, 1);
    barEl.style.width = `${Math.round(p * 100)}%`;
  };

  const renderMacros = () => {
    const target = appState.run.nutrition;
    const consumed = computeConsumed();

    macroTotalsInline.textContent = `${consumed.calories} / ${target.calories} ккал`;

    macrosCalories.textContent = `${consumed.calories} / ${target.calories} ккал`;
    macrosProtein.textContent = `${consumed.proteinG} / ${target.proteinG} г`;
    macrosCarbs.textContent = `${consumed.carbsG} / ${target.carbsG} г`;
    macrosFats.textContent = `${consumed.fatG} / ${target.fatG} г`;

    setBar(barCalories, consumed.calories / target.calories);
    setBar(barProtein, consumed.proteinG / target.proteinG);
    setBar(barCarbs, consumed.carbsG / target.carbsG);
    setBar(barFats, consumed.fatG / target.fatG);
  };

  const renderHeader = () => {
    const { start, todayIndex } = runInfo();
    const duration = appState.run.durationDays;

    const selectedIndex = diffDays(start, appState.selectedDate);
    const dayNum = clamp(selectedIndex + 1, 1, duration);

    marathonProgress.textContent = `День ${dayNum} из ${duration}`;

    const n = appState.run.nutrition;
    targetCalories.textContent = `${n.calories} ккал`;
    macroSummary.textContent = `Б ${n.proteinG}г • У ${n.carbsG}г • Ж ${n.fatG}г`;

    const editable = isEditingAllowedForISO(appState.selectedDate);
    const note = editable
      ? "Сегодня (можно отмечать)."
      : selectedIndex < todayIndex
        ? "Прошедший день (только просмотр)."
        : "Будущий день (заблокирован).";

    const ex = appState.profile.exclusionsDisplay || appState.profile.exclusions || [];
    const exText = ex.length ? `Исключения применены: ${ex.join(", ")}` : "Исключения: нет";
    exclusionsDisclaimer.textContent = `${exText} · ${note}`;

    const personalNote = appState.run.planByDate?.personalNote;
    if (personalNote) {
      personalAIAdvice.textContent = personalNote;
      personalAIAdvice.classList.remove("hidden");
    } else {
      personalAIAdvice.classList.add("hidden");
    }

    const safety = appState.profile?.safety || {};
    const flags = [];
    if (safety.pregnancy) flags.push("беременность/ГВ");
    if (safety.ed) flags.push("РПП");
    if (safety.kidney) flags.push("почки");
    if (safety.gout) flags.push("подагра/мочевая кислота");

    if (flags.length > 0) {
      safetyBanner.textContent = `Важно: вы отметили ${flags.join(", ")}. Приложение не заменяет врача; при необходимости согласуйте рацион со специалистом.`;
      safetyBanner.classList.remove("hidden");
    } else {
      safetyBanner.classList.add("hidden");
    }
  };

  const ensureScaleSelect = (selectEl) => {
    if (!selectEl) return;
    if (selectEl.options.length > 0) return;
    for (let i = 1; i <= 10; i += 1) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = String(i);
      selectEl.appendChild(opt);
    }
    selectEl.value = "5";
  };

  const parseIngredientWithWeight = (str) => {
    const match = String(str || "").match(/(.+?)\s*—\s*(\d+)\s*(г|мл)/i);
    if (!match) return null;
    const name = match[1].trim();
    const weight = Number(match[2]);
    const unit = match[3].toLowerCase();
    if (!name || !Number.isFinite(weight)) return null;
    return { name, nameLower: name.toLowerCase(), weight, unit };
  };

  const ingredientType = (nameLower) => {
    const key = String(nameLower || "").trim();
    const data = INGREDIENT_DATA[key];
    if (data?.type) return data.type;
    if (key.includes("овощ")) return "veg";
    return "other";
  };

  const fiberEstimateFor = (type, nameLower, weightG) => {
    const w = Number(weightG) || 0;
    if (w <= 0) return 0;
    if (String(nameLower || "").includes("отруб")) return w * 0.4;
    if (type === "veg") return w * 0.03;
    if (type === "fruit") return w * 0.02;
    if (type === "legume") return w * 0.07;
    if (type === "grain") return w * 0.06;
    return 0;
  };

  const analyzeMealForQuality = (meal) => {
    let vegG = 0;
    let fruitG = 0;
    let fiberG = 0;

    const add = (name, weight, unit) => {
      if (!weight || unit !== "г") return;
      const nameLower = String(name || "").toLowerCase().trim();
      const type = ingredientType(nameLower);
      if (type === "veg") vegG += weight;
      if (type === "fruit") fruitG += weight;
      fiberG += fiberEstimateFor(type, nameLower, weight);
    };

    if (meal?.calculatedIngredients && Array.isArray(meal.calculatedIngredients)) {
      meal.calculatedIngredients.forEach((ing) => {
        add(ing.name, ing.weight, ing.unit || "г");
      });
    } else if (meal?.ingredientsWithWeights && Array.isArray(meal.ingredientsWithWeights)) {
      meal.ingredientsWithWeights.forEach((line) => {
        const parsed = parseIngredientWithWeight(line);
        if (!parsed) return;
        add(parsed.name, parsed.weight, parsed.unit);
      });
    }

    return { vegG, fruitG, fiberG };
  };

  const mealHasAnyKeyword = (meal, keywords) => {
    const hay = `${meal?.name || ""} ${meal?.mainIngredient || ""}`.toLowerCase();
    if (keywords.some(k => hay.includes(k))) return true;

    if (meal?.calculatedIngredients && Array.isArray(meal.calculatedIngredients)) {
      const txt = meal.calculatedIngredients.map(i => i.name).join(" ").toLowerCase();
      if (keywords.some(k => txt.includes(k))) return true;
    }
    if (meal?.ingredientsWithWeights && Array.isArray(meal.ingredientsWithWeights)) {
      const txt = meal.ingredientsWithWeights.join(" ").toLowerCase();
      if (keywords.some(k => txt.includes(k))) return true;
    }
    return false;
  };

  const computeQualityForISO = (iso) => {
    const day = ensureDayData(appState.run, iso);
    const plan = appState.run.planByDate[iso] || appState.run.planByDate[appState.run.startDate];
    const meals = plan ? Object.values(plan) : [];

    let vegG = 0;
    let fruitG = 0;
    let fiberG = 0;

    meals.forEach((m) => {
      const a = analyzeMealForQuality(m);
      vegG += a.vegG;
      fruitG += a.fruitG;
      fiberG += a.fiberG;
    });

    const fishKeywords = ["минтай", "горбуш", "тунец", "рыба"];
    const legumeKeywords = ["фасол", "нут", "чечев", "горох"];

    const selectedIndex = diffDays(appState.run.startDate, iso);
    const startIndex = Math.max(0, selectedIndex - 6);
    const weekDates = [];
    for (let i = startIndex; i <= selectedIndex; i += 1) {
      const d = new Date(appState.run.startDate);
      d.setDate(d.getDate() + i);
      weekDates.push(toLocalISODate(d));
    }

    let fishServings = 0;
    let legumesServings = 0;
    weekDates.forEach((dIso) => {
      const p = appState.run.planByDate[dIso];
      if (!p) return;
      Object.values(p).forEach((m) => {
        if (m?.isFish || mealHasAnyKeyword(m, fishKeywords)) fishServings += 1;
        if (mealHasAnyKeyword(m, legumeKeywords)) legumesServings += 1;
      });
    });

    const waterMl = Number(day.checkin?.waterMl) || 0;

    const targets = {
      vegG: 400,
      fruitG: 200,
      waterMl: 1500,
      fiberG: 25,
      fishServings: 2,
      legumesServings: 2,
    };

    const points = {
      vegG: 2,
      fruitG: 1.5,
      waterMl: 2,
      fiberG: 2,
      fishServings: 1.5,
      legumesServings: 1,
    };

    const score = clamp(
      (Math.min(vegG / targets.vegG, 1) * points.vegG)
        + (Math.min(fruitG / targets.fruitG, 1) * points.fruitG)
        + (Math.min(waterMl / targets.waterMl, 1) * points.waterMl)
        + (Math.min(fiberG / targets.fiberG, 1) * points.fiberG)
        + (Math.min(fishServings / targets.fishServings, 1) * points.fishServings)
        + (Math.min(legumesServings / targets.legumesServings, 1) * points.legumesServings),
      0,
      10
    );

    let tip = "";
    const deficits = [
      { key: "water", val: waterMl / targets.waterMl, text: "Добавьте воду: цель 1500 мл. Налейте бутылку и допейте до вечера." },
      { key: "veg", val: vegG / targets.vegG, text: "Добавьте овощи: цель 400 г/день. Проще всего — огурец/капуста к каждому приёму." },
      { key: "fruit", val: fruitG / targets.fruitG, text: "Добавьте фрукты: 1-2 порции в день (200 г)." },
      { key: "fiber", val: fiberG / targets.fiberG, text: "Добавьте клетчатку: больше овощей/отрубей/бобовых." },
      { key: "fish", val: fishServings / targets.fishServings, text: "На этой неделе мало рыбы: цель 2 раза/7 дней." },
      { key: "legumes", val: legumesServings / targets.legumesServings, text: "На этой неделе мало бобовых: цель 2 раза/7 дней." },
    ].sort((a, b) => a.val - b.val);
    tip = deficits[0]?.text || "";

    const c = day.checkin || {};
    if (Number(c.hunger) >= 8) {
      tip = "Если голодно: добавьте объём — овощи/салат + чуть больше белка. Сладкое не решает голод надолго.";
    }
    if (Number(c.cravings) >= 8) {
      tip = "Если сильная тяга: сделайте перекус белок+клетчатка (творог/кефир + яблоко/овощи).";
    }
    if (Number(c.digestion) <= 3) {
      tip = "Если ЖКТ дискомфорт: сегодня выбирайте тёплую, простую еду (тушёное/варёное), меньше жареного и сырых объёмных салатов.";
    }

    return { vegG, fruitG, waterMl, fiberG, fishServings, legumesServings, score, tip };
  };

  const renderQuality = () => {
    if (!appState.run || !appState.profile) return;
    const iso = appState.selectedDate;
    const q = computeQualityForISO(iso);

    if (qualityScore) qualityScore.textContent = `${Math.round(q.score)}/10`;
    if (qualityVeg) qualityVeg.textContent = `${Math.round(q.vegG)} / 400 г`;
    if (qualityFruit) qualityFruit.textContent = `${Math.round(q.fruitG)} / 200 г`;
    if (qualityWater) qualityWater.textContent = `${Math.round(q.waterMl)} / 1500 мл`;
    if (qualityFiber) qualityFiber.textContent = `${Math.round(q.fiberG)} / 25 г`;
    if (qualityFish) qualityFish.textContent = `${q.fishServings} / 2`;
    if (qualityLegumes) qualityLegumes.textContent = `${q.legumesServings} / 2`;
    if (qualityTip) qualityTip.textContent = q.tip;

    setBar(qualityVegBar, q.vegG / 400);
    setBar(qualityFruitBar, q.fruitG / 200);
    setBar(qualityWaterBar, q.waterMl / 1500);
    setBar(qualityFiberBar, q.fiberG / 25);
  };

  const renderCheckin = () => {
    if (!appState.run) return;

    ensureScaleSelect(hungerInput);
    ensureScaleSelect(energyInput);
    ensureScaleSelect(cravingsLevelInput);
    ensureScaleSelect(digestionComfortInput);

    const iso = appState.selectedDate;
    const day = ensureDayData(appState.run, iso);
    const c = day.checkin || { waterMl: 0, hunger: 5, energy: 5, cravings: 5, digestion: 5 };

    if (waterMlInput) waterMlInput.value = c.waterMl ? String(c.waterMl) : "";
    if (hungerInput) hungerInput.value = String(c.hunger ?? 5);
    if (energyInput) energyInput.value = String(c.energy ?? 5);
    if (cravingsLevelInput) cravingsLevelInput.value = String(c.cravings ?? 5);
    if (digestionComfortInput) digestionComfortInput.value = String(c.digestion ?? 5);

    const editable = isEditingAllowedForISO(iso);
    [waterMlInput, hungerInput, energyInput, cravingsLevelInput, digestionComfortInput].forEach((inp) => {
      if (!inp) return;
      inp.disabled = !editable;
      inp.classList.toggle("opacity-60", !editable);
    });
  };

  const renderWeightChart = () => {
    const ctx = el("weightChart").getContext("2d");
    const { start } = runInfo();
    const duration = appState.run.durationDays;
    
    const labels = [];
    const data = [];
    
    for (let i = 0; i < duration; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const iso = toLocalISODate(d);
      labels.push(d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }));
      
      const day = appState.run.days[iso];
      data.push(day ? day.weight : null);
    }

    if (weightChartInstance) weightChartInstance.destroy();

    weightChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Вес (кг)",
          data: data,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          borderWidth: 3,
          tension: 0.4,
          pointBackgroundColor: "#10b981",
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          spanGaps: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#0f172a",
            padding: 10,
            titleFont: { size: 12, weight: "bold" },
            bodyFont: { size: 12 }
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: "rgba(226, 232, 240, 0.5)" },
            ticks: { font: { size: 10, weight: "600" }, color: "#64748b" }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10, weight: "600" }, color: "#64748b" }
          }
        }
      }
    });
  };

  const generateShoppingList = () => {
    const { start } = runInfo();
    const duration = appState.run.durationDays;
    const totals = {};
    const checkedItems = JSON.parse(localStorage.getItem("gh_shopping_checked_v1") || "[]");

    // Собираем продукты за весь период марафона
    for (let i = 0; i < duration; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const iso = toLocalISODate(d);
      const plan = appState.run.planByDate[iso];
      if (!plan) continue;

      Object.entries(plan).forEach(([cat, meal]) => {
        if (cat === "personalNote") return;
        // Проверяем оба типа ингредиентов: из библиотеки и от ИИ
        const ings = meal.calculatedIngredients || [];
        
        ings.forEach(ing => {
          if (!ing.weight) return;
          const key = `${ing.name} (${ing.unit})`;
          totals[key] = (totals[key] || 0) + ing.weight;
        });

        // Если есть ингредиенты напрямую от ИИ (в строковом формате)
        if (meal.ingredientsWithWeights && !meal.calculatedIngredients) {
          meal.ingredientsWithWeights.forEach(str => {
            const match = str.match(/(.+?)\s*—\s*(\d+)\s*(г|мл)/i);
            if (match) {
              const [_, name, weight, unit] = match;
              const key = `${name.trim()} (${unit})`;
              totals[key] = (totals[key] || 0) + parseInt(weight);
            }
          });
        }
      });
    }

    shoppingListContent.innerHTML = "";
    
    if (Object.keys(totals).length === 0) {
      shoppingListContent.innerHTML = `<div class="text-center text-slate-500 py-10">Сначала создайте план питания</div>`;
      return;
    }

    const groups = {
      "Мясо и Рыба": ["курица", "индейка", "минтай", "горбуша", "печень", "говядина", "тунец", "стейк", "филе", "фарш", "сердечки"],
      "Овощи и Фрукты": ["яблоко", "груша", "банан", "грейпфрут", "морковь", "свекла", "огурец", "помидор", "кабачок", "тыква", "капуста", "лук", "чеснок", "зелень"],
      "Крупы и Бакалея": ["гречка", "рис", "макароны", "перловка", "овсянка", "манка", "пшено", "ячка", "кускус", "фасоль", "хлеб", "хлебец", "картофель", "мука", "сахар", "соль", "специи"],
      "Молочные продукты": ["творог", "яйца", "молоко", "кефир", "ряженка", "сметана", "сыр", "масло", "йогурт"],
      "Прочее": []
    };

    const categorized = {};
    Object.keys(groups).forEach(g => categorized[g] = []);

    Object.entries(totals).forEach(([nameAndUnit, weight]) => {
      const name = nameAndUnit.split(" (")[0].toLowerCase();
      let found = false;
      for (const [group, items] of Object.entries(groups)) {
        if (items.some(item => name.includes(item))) {
          categorized[group].push({ display: nameAndUnit, weight });
          found = true;
          break;
        }
      }
      if (!found) categorized["Прочее"].push({ display: nameAndUnit, weight });
    });

    Object.entries(categorized).forEach(([group, items]) => {
      if (items.length === 0) return;
      
      const div = document.createElement("div");
      div.className = "mb-6 last:mb-0";
      div.innerHTML = `<h4 class="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 ml-1">${group}</h4>`;
      
      const ul = document.createElement("ul");
      ul.className = "space-y-2";
      
      items.forEach(item => {
        const isChecked = checkedItems.includes(item.display);
        const li = document.createElement("li");
        li.className = `flex items-center gap-3 rounded-2xl px-4 py-3 ring-1 transition-all cursor-pointer ${
          isChecked ? "bg-slate-50 ring-slate-100 opacity-60" : "bg-white ring-slate-200 hover:ring-emerald-200"
        }`;
        
        li.innerHTML = `
          <div class="flex-shrink-0 h-5 w-5 rounded-md border-2 transition-colors flex items-center justify-center ${
            isChecked ? "bg-emerald-500 border-emerald-500" : "bg-white border-slate-300"
          }">
            ${isChecked ? '<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>' : ''}
          </div>
          <div class="flex flex-1 items-center justify-between">
            <span class="text-sm font-medium ${isChecked ? "text-slate-400 line-through" : "text-slate-700"}">${item.display.split(" (")[0]}</span>
            <span class="text-sm font-bold ${isChecked ? "text-slate-400" : "text-slate-900"}">${item.weight} ${item.display.split(" (")[1].replace(")", "")}</span>
          </div>
        `;

        li.addEventListener("click", () => {
          const currentChecked = JSON.parse(localStorage.getItem("gh_shopping_checked_v1") || "[]");
          if (currentChecked.includes(item.display)) {
            const index = currentChecked.indexOf(item.display);
            currentChecked.splice(index, 1);
          } else {
            currentChecked.push(item.display);
          }
          localStorage.setItem("gh_shopping_checked_v1", JSON.stringify(currentChecked));
          generateShoppingList(); // перерисовываем
        });

        ul.appendChild(li);
      });
      
      div.appendChild(ul);
      shoppingListContent.appendChild(div);
    });
  };

  const openShoppingList = () => {
    generateShoppingList();
    shoppingListModal.classList.remove("hidden");
    setTimeout(() => shoppingListModal.classList.remove("opacity-0", "scale-95"), 10);
  };

  const closeShoppingList = () => {
    shoppingListModal.classList.add("opacity-0", "scale-95");
    setTimeout(() => shoppingListModal.classList.add("hidden"), 300);
  };

  const renderDashboard = () => {
    resetBtn.classList.remove("hidden");
    if (!appState.selectedDate) appState.selectedDate = runInfo().today;

    renderHeader();
    renderCalendar();
    renderSteps();
    renderCheckin();
    renderQuality();
    renderMeals();
    renderMacros();
    renderWeightChart();
    saveStorage();
  };

  const validateProfile = (p) => {
    const missing = [];
    if (!Number.isFinite(p.age) || p.age < 10) missing.push("возраст");
    if (!p.gender) missing.push("пол");
    if (!Number.isFinite(p.heightCm) || p.heightCm < 120) missing.push("рост");
    if (!Number.isFinite(p.weightKg) || p.weightKg < 35) missing.push("вес");
    if (!p.disclaimerAgree) missing.push("согласие");
    return missing;
  };

  const fetchGeminiPlan = async (profile, nutrition, durationDays) => {
    const buildLocalPlan = () => {
      const plan = {};
      for (let i = 0; i < durationDays; i++) {
        const date = new Date(appState.run.startDate);
        date.setDate(date.getDate() + i);
        plan[toLocalISODate(date)] = buildPlanForDay(nutrition, profile.exclusionsNormalized);
      }
      plan.personalNote = "План составлен на основе локальной библиотеки (ИИ временно недоступен).";
      return plan;
    };

    if (!GEMINI_API_KEY || GEMINI_API_KEY.includes("AIzaSyCoc86_dpfX8iKVzr-PCoiO-99tyx4-LMA")) {
      return buildLocalPlan();
    }

    const cravingsText = (profile.behavior?.cravings || []).length > 0 
      ? `Тяга к: ${profile.behavior.cravings.join(", ")}.` 
      : "";

    const healthText = `Здоровье: Хронические заболевания - ${profile.health?.chronic || "нет"}, Особенности пищеварения - ${profile.health?.digestion || "нет"}.`;
    const lifestyleText = `Образ жизни: Сон - ${profile.lifestyle?.sleep || "норма"}, Уровень стресса - ${profile.lifestyle?.stress || "5"}/10.`;
    const inventoryText = (profile.behavior?.inventory || []).length > 0
      ? `ПРОДУКТЫ В НАЛИЧИИ (приоритизируй их): ${profile.behavior.inventory.join(", ")}.`
      : "";
    const behaviorText = `Поведение: Тип питания - ${profile.behavior?.pref || "all"}, Приемов пищи - ${profile.behavior?.meals || "3"}, Время на готовку - до ${profile.behavior?.cookTime || "30"} мин. ${cravingsText} ${inventoryText}`;

    const prompt = `
      Ты — нутрициолог-терапевт. Создай план питания на ${durationDays} дней для марафона.
      ПРОДУКТЫ ДОЛЖНЫ БЫТЬ ПРОСТЫМИ, ДОСТУПНЫМИ И НЕДОРОГИМИ.
      
      КОНТЕКСТ ПОЛЬЗОВАТЕЛЯ:
      Данные: Возраст ${profile.age}, ${profile.gender}, вес ${profile.weightKg}кг, рост ${profile.heightCm}см.
      Цель: ${nutrition.calories} ккал, Б: ${nutrition.proteinG}г, У: ${nutrition.carbsG}г, Ж: ${nutrition.fatG}г.
      Исключить: ${profile.exclusionsDisplay.join(", ")}.
      
      ${healthText}
      ${lifestyleText}
      ${behaviorText}
      
      ДАННЫЕ О ЖЕЛАЕМОМ БЛЮДЕ:
      У пользователя может быть высокий стресс или плохой сон — в этом случае подбери соответствующее блюдо (например, с магнием или антиоксидантами).
      Время приготовления не должно превышать ${profile.maxCookingTime || profile.behavior?.cookTime || 30} минут.
      Оборудование: ${profile.equipment || "any"}. Если выбрано "Без духовки" — не используй духовку и не предлагай запекание.
      Заготовки: ${profile.hasPrep ? "есть" : "нет"}. Если заготовок нет, не предлагай блюда, требующие долгого приготовления круп/мяса.

      ЦЕЛИ КАЧЕСТВА (важно):
      - Овощи: минимум 400 г/день.
      - Фрукты: минимум 200 г/день.
      - Клетчатка: ориентир ~25 г/день (овощи, фрукты, отруби, бобовые).
      - Рыба: минимум 2 раза за 7 дней.
      - Бобовые: минимум 2 раза за 7 дней.

      ПРАВИЛА ПО ЗДОРОВЬЮ:
      - Если диабет: избегай сладких напитков/соков и явных быстрых углеводов, чаще добавляй овощи и белок к приёму пищи.
      - Если ЖКТ/есть жалобы на пищеварение: меньше жареного/острого, больше тушёного/варёного.

      SAFETY:
      Если отмечены флаги беременность/ГВ, РПП, болезни почек или подагра — не предлагай экстремальные ограничения и сделай рацион максимально мягким.

      ИНСТРУКЦИИ ДЛЯ ПЛАНА:
      1. Если сон плохой (lifestyle sleep poor) — добавь продукты, богатые магнием (орехи, семена, гречка) и триптофаном (индейка, сыр, яйца).
      2. Учти уровень стресса. При высоком стрессе — больше антиоксидантов и меньше кофеина.
      3. Рецепты должны быть максимально быстрыми, так как время на готовку ограничено ${profile.behavior?.cookTime} мин.
      4. Учти тягу к ${profile.behavior?.cravings?.join("/") || "сладкому/соленому"} и интегрируй в перекусы здоровые альтернативы этим триггерам (например, фрукты вместо сладкого, орехи вместо соленого).
      5. Если выбрано вегетарианство или кето — строго соблюдай этот тип питания.
      6. Количество приемов пищи должно быть ровно ${profile.behavior?.meals}.
      7. В самом конце ответа добавь поле "personalNote" (строка), где кратко (2-3 предложения) объясни, почему этот план подходит именно этому пользователю, основываясь на его данных о здоровье, сне и уровне стресса. Например: "Так как у вас высокий уровень стресса, мы добавили больше продуктов с антиоксидантами...".

      Ответ СТРОГО в формате JSON, где ключи — даты YYYY-MM-DD, начиная с ${appState.run.startDate}.
      Также добавь ключ "personalNote" в корень объекта.
      Каждый день содержит приемы пищи (от 2 до 5 согласно настройке).
      В каждом приеме пищи: 
      "name" (строка), 
      "ingredientsWithWeights" (массив строк с указанием граммовки), 
      "macros" (объект: calories, proteinG, carbsG, fatG),
      "instructions" (массив строк с шагами приготовления).
      Только русский язык. Только чистый JSON без markdown.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    try {
      console.log("Отправка запроса по адресу:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Full error response from Google:", errorData);
        const errMsg = errorData.error?.message || `Ошибка API: ${response.status}`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn("Gemini Error, falling back to local plan:", err);
      return buildLocalPlan();
    }
  };

  const startMarathon = async () => {
    const age = Number(ageInput.value);
    const gender = genderInput.value;
    const heightCm = Number(heightInput.value);
    const weightKg = Number(weightInput.value);

    const profile = {
      age,
      gender,
      heightCm,
      weightKg,
      activity: activityInput.value,
      exclusionsDisplay: parseExclusionsDisplay(exclusionsInput.value),
      exclusionsNormalized: normalizeExclusions(parseExclusionsDisplay(exclusionsInput.value)),
      goal: selectedGoal,
      durationDays: selectedDays,
      health: {
        chronic: healthChronicInput.value,
        digestion: healthDigestionInput.value
      },
      lifestyle: {
        sleep: lifestyleSleepInput.value,
        stress: lifestyleStressInput.value
      },
      behavior: {
        pref: behaviorPrefInput.value,
        meals: Number(behaviorMealsInput.value),
        cookTime: behaviorCookTimeInput.value,
        cravings: Array.from(behaviorCravingsGroup.querySelectorAll("input:checked")).map(cb => cb.value),
        inventory: (inventoryInput.value || "").split(/,|\n/).map(s => s.trim().toLowerCase()).filter(Boolean)
      },
      maxCookingTime: Number(behaviorCookTimeInput.value) || 30,
      equipment: equipmentInput?.value || "any",
      hasPrep: !!hasPrepInput?.checked,
      disclaimerAgree: !!disclaimerAgreeInput?.checked,
      safety: {
        pregnancy: !!flagPregnancyInput?.checked,
        ed: !!flagEdInput?.checked,
        kidney: !!flagKidneyInput?.checked,
        gout: !!flagGoutInput?.checked,
      }
    };

    const errs = validateProfile(profile);
    if (errs.length) {
      if (errs.includes("согласие")) {
        disclaimerError.textContent = "Пожалуйста, подтвердите согласие с дисклеймером.";
        disclaimerError.classList.remove("hidden");
      } else {
        disclaimerError.classList.add("hidden");
      }

      const filtered = errs.filter(e => e !== "согласие");
      onboardingError.textContent = filtered.length
        ? "Заполните обязательные поля: " + filtered.join(", ")
        : "";
      onboardingError.classList.remove("hidden");
      return;
    }

    disclaimerError.classList.add("hidden");

    appState.profile = profile;
    const nutrition = computeNutrition(profile);
    const startDate = toLocalISODate(new Date());

    appState.run = {
      startDate,
      durationDays: selectedDays,
      nutrition,
      days: {},
      planByDate: {}
    };

    analyzeBtn.disabled = true;
    analyzeStatus.classList.remove("hidden");
    analyzeStatus.classList.add("flex");
    onboardingError.classList.add("hidden");

    try {
      const plan = await fetchGeminiPlan(profile, nutrition, selectedDays);
      appState.run.planByDate = plan;
      saveStorage();
      onboardingView.classList.add("view-hidden");
      setTimeout(() => {
        onboardingView.classList.add("hidden");
        dashboardView.classList.remove("hidden");
        setTimeout(() => dashboardView.classList.remove("view-hidden"), 50);
        appHeader.classList.remove("hidden");
        resetBtn.classList.remove("hidden");
        appState.selectedDate = startDate;
        renderDashboard();
      }, 400);
    } catch (err) {
      onboardingError.textContent = err.message;
      onboardingError.classList.remove("hidden");
    } finally {
      analyzeBtn.disabled = false;
      analyzeStatus.classList.add("hidden");
      analyzeStatus.classList.remove("flex");
    }
  };

  const setDurationUI = (days) => {
    selectedDays = days;
    [duration7Btn, duration14Btn].forEach(btn => {
      const isActive = Number(btn.dataset.days) === days;
      if (isActive) {
        btn.classList.add("bg-emerald-50", "text-emerald-800", "ring-emerald-200");
        btn.classList.remove("bg-white", "text-slate-700", "ring-slate-200");
      } else {
        btn.classList.remove("bg-emerald-50", "text-emerald-800", "ring-emerald-200");
        btn.classList.add("bg-white", "text-slate-700", "ring-slate-200");
      }
    });
  };

  const setGoalUI = (goal) => {
    selectedGoal = goal;
    document.querySelectorAll(".goal-btn").forEach((btn) => {
      const isActive = btn.dataset.goal === goal;
      if (isActive) {
        btn.classList.add("bg-emerald-50", "text-emerald-800", "ring-emerald-200");
        btn.classList.remove("bg-white", "text-slate-700", "ring-slate-200");
      } else {
        btn.classList.remove("bg-emerald-50", "text-emerald-800", "ring-emerald-200");
        btn.classList.add("bg-white", "text-slate-700", "ring-slate-200");
      }
    });
  };

  const preloadOnboardingFromStorage = () => {
    const p = appState.profile;
    if (!p) return;

    ageInput.value = String(p.age ?? "");
    genderInput.value = p.gender || "female";
    heightInput.value = String(p.heightCm ?? "");
    weightInput.value = String(p.weightKg ?? "");
    activityInput.value = p.activity || "moderate";
    exclusionsInput.value = (p.exclusionsDisplay || p.exclusions || []).join(", ");

    if (p.health) {
      healthChronicInput.value = p.health.chronic || "none";
      healthDigestionInput.value = p.health.digestion || "";
    }
    if (p.lifestyle) {
      lifestyleSleepInput.value = p.lifestyle.sleep || "normal_6_8";
      lifestyleStressInput.value = p.lifestyle.stress || "5";
    }
    if (p.behavior) {
      behaviorPrefInput.value = p.behavior.pref || "all";
      behaviorMealsInput.value = String(p.behavior.meals || 3);
      behaviorCookTimeInput.value = p.behavior.cookTime || "30";
      inventoryInput.value = (p.behavior.inventory || []).join(", ");
      const cravings = p.behavior.cravings || [];
      behaviorCravingsGroup.querySelectorAll("input").forEach(cb => {
        cb.checked = cravings.includes(cb.value);
      });
    }

    if (equipmentInput) equipmentInput.value = p.equipment || "any";
    if (hasPrepInput) hasPrepInput.checked = !!p.hasPrep;
    if (disclaimerAgreeInput) disclaimerAgreeInput.checked = !!p.disclaimerAgree;

    if (flagPregnancyInput) flagPregnancyInput.checked = !!p.safety?.pregnancy;
    if (flagEdInput) flagEdInput.checked = !!p.safety?.ed;
    if (flagKidneyInput) flagKidneyInput.checked = !!p.safety?.kidney;
    if (flagGoutInput) flagGoutInput.checked = !!p.safety?.gout;

    setDurationUI(p.durationDays || 7);
    setGoalUI(p.goal || "lose");
  };

  const bindEvents = () => {
    duration7Btn.addEventListener("click", () => setDurationUI(7));
    duration14Btn.addEventListener("click", () => setDurationUI(14));
    document.querySelectorAll(".goal-btn").forEach((btn) => {
      btn.addEventListener("click", () => setGoalUI(btn.dataset.goal));
    });

    analyzeBtn.addEventListener("click", startMarathon);
    closeRecipeBtn.addEventListener("click", closeRecipeModal);
    recipeModal.addEventListener("click", (e) => {
      if (e.target === recipeModal) closeRecipeModal();
    });

    weightInputToday?.addEventListener("input", () => {
      const iso = appState.selectedDate;
      const day = ensureDayData(appState.run, iso);
      const val = parseFloat(weightInputToday.value);
      day.weight = isNaN(val) ? null : val;
      saveStorage();
      renderWeightChart();
    });

    stepsInput?.addEventListener("input", () => {
      const iso = appState.selectedDate;
      const day = ensureDayData(appState.run, iso);
      const val = Math.max(0, Math.round(Number(stepsInput.value || 0)));
      day.steps = val;
      saveStorage();
      renderDashboard();
    });

    const updateCheckin = (patch) => {
      if (!appState.run) return;
      const iso = appState.selectedDate;
      const day = ensureDayData(appState.run, iso);
      day.checkin = { ...day.checkin, ...patch };
      saveStorage();
      renderQuality();
    };

    waterMlInput?.addEventListener("input", () => {
      const val = Math.max(0, Math.round(Number(waterMlInput.value || 0)));
      updateCheckin({ waterMl: val });
    });
    hungerInput?.addEventListener("change", () => updateCheckin({ hunger: Number(hungerInput.value || 5) }));
    energyInput?.addEventListener("change", () => updateCheckin({ energy: Number(energyInput.value || 5) }));
    cravingsLevelInput?.addEventListener("change", () => updateCheckin({ cravings: Number(cravingsLevelInput.value || 5) }));
    digestionComfortInput?.addEventListener("change", () => updateCheckin({ digestion: Number(digestionComfortInput.value || 5) }));

    openShoppingListBtn.addEventListener("click", openShoppingList);
    closeShoppingListBtn.addEventListener("click", closeShoppingList);
    copyShoppingListBtn.addEventListener("click", () => {
      const text = Array.from(shoppingListContent.querySelectorAll("li")).map(li => {
        const span = li.querySelector(".flex-1 span:first-child");
        const weight = li.querySelector(".flex-1 span:last-child");
        return `${span.textContent}: ${weight.textContent}`;
      }).join("\n");
      navigator.clipboard.writeText(text).then(() => {
        copyShoppingListBtn.textContent = "Скопировано!";
        setTimeout(() => copyShoppingListBtn.textContent = "Копировать список", 2000);
      });
    });

    resetBtn.addEventListener("click", resetAll);

    // События БЖУ модалки
    editMacrosBtn.addEventListener("click", openMacrosModal);
    closeMacrosModal.addEventListener("click", closeMacrosModalFunc);
    editMacrosModal.addEventListener("click", (e) => {
      if (e.target === editMacrosModal) closeMacrosModalFunc();
    });
    [editProteinInput, editFatsInput, editCarbsInput].forEach(inp => {
      inp.addEventListener("input", updateEditCalories);
    });
    saveMacrosBtn.addEventListener("click", saveManualMacros);
    resetMacrosBtn.addEventListener("click", () => {
      const calculated = computeNutrition(appState.profile);
      editProteinInput.value = calculated.proteinG;
      editFatsInput.value = calculated.fatG;
      editCarbsInput.value = calculated.carbsG;
      updateEditCalories();
    });
  };

  const init = () => {
    ensureScaleSelect(hungerInput);
    ensureScaleSelect(energyInput);
    ensureScaleSelect(cravingsLevelInput);
    ensureScaleSelect(digestionComfortInput);
    setDurationUI(7);
    setGoalUI("lose");
    bindEvents();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    }
    const has = loadStorage();
    if (has) {
      migrateRunIfNeeded();
      if (appState.run?.days && typeof appState.run.days === "object") {
        Object.keys(appState.run.days).forEach((iso) => {
          ensureDayData(appState.run, iso);
        });
      }
      preloadOnboardingFromStorage();
      appHeader.classList.remove("hidden");
      resetBtn.classList.remove("hidden");
      onboardingView.classList.add("hidden");
      dashboardView.classList.remove("hidden");
      setTimeout(() => dashboardView.classList.remove("view-hidden"), 50);
      if (!appState.selectedDate) appState.selectedDate = runInfo().today;
      renderDashboard();
    } else {
      preloadOnboardingFromStorage();
      appHeader.classList.add("hidden");
      resetBtn.classList.add("hidden");
    }
  };

  init();
})();
