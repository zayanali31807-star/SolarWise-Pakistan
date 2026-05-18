import { useState, useEffect, useCallback, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const APPLIANCES = [
  { id: "fan_ceiling_ac",   name: "Ceiling Fan (AC)",          urdu: "سیلنگ فین AC",        icon: "🌀", watt: 75,   category: "Cooling" },
  { id: "fan_ceiling_dc",   name: "Ceiling Fan (DC Inverter)", urdu: "سیلنگ فین DC",         icon: "🌀", watt: 28,   category: "Cooling" },
  { id: "fan_ceiling_acdc", name: "Ceiling Fan (AC/DC Solar)", urdu: "سیلنگ فین AC/DC",      icon: "🌀", watt: 35,   category: "Cooling" },
  { id: "fan_table_ac",     name: "Table Fan (AC)",            urdu: "ٹیبل فین AC",          icon: "💨", watt: 50,   category: "Cooling" },
  { id: "fan_table_dc",     name: "Table Fan (DC)",            urdu: "ٹیبل فین DC",          icon: "💨", watt: 20,   category: "Cooling" },
  { id: "fan_pedestal",     name: "Pedestal Fan",              urdu: "پیڈسٹل فین",          icon: "💨", watt: 60,   category: "Cooling" },
  { id: "fan_exhaust",      name: "Exhaust Fan",               urdu: "ایگزاسٹ فین",         icon: "🌬️", watt: 30,   category: "Cooling" },
  { id: "ac_1ton",          name: "AC 1 Ton (Non-Inverter)",   urdu: "AC 1 ٹن",             icon: "❄️", watt: 1500, category: "Cooling" },
  { id: "ac_15ton",         name: "AC 1.5 Ton (Non-Inverter)", urdu: "AC 1.5 ٹن",           icon: "❄️", watt: 2000, category: "Cooling" },
  { id: "ac_2ton",          name: "AC 2 Ton (Non-Inverter)",   urdu: "AC 2 ٹن",             icon: "❄️", watt: 2500, category: "Cooling" },
  { id: "ac_1ton_inv",      name: "AC 1 Ton (Inverter)",       urdu: "AC 1 ٹن انورٹر",      icon: "❄️", watt: 900,  category: "Cooling" },
  { id: "ac_15ton_inv",     name: "AC 1.5 Ton (Inverter)",     urdu: "AC 1.5 ٹن انورٹر",   icon: "❄️", watt: 1300, category: "Cooling" },
  { id: "ac_2ton_inv",      name: "AC 2 Ton (Inverter)",       urdu: "AC 2 ٹن انورٹر",      icon: "❄️", watt: 1700, category: "Cooling" },
  { id: "air_cooler",       name: "Air Cooler",                urdu: "ایئر کولر",           icon: "🌬️", watt: 200,  category: "Cooling" },
  { id: "led_7w",           name: "LED Bulb 7W",               urdu: "LED بلب 7W",          icon: "💡", watt: 7,    category: "Lighting" },
  { id: "led_10w",          name: "LED Bulb 10W",              urdu: "LED بلب 10W",         icon: "💡", watt: 10,   category: "Lighting" },
  { id: "led_15w",          name: "LED Bulb 15W",              urdu: "LED بلب 15W",         icon: "💡", watt: 15,   category: "Lighting" },
  { id: "tube_light",       name: "Tube Light (LED)",          urdu: "ٹیوب لائٹ",          icon: "🔦", watt: 20,   category: "Lighting" },
  { id: "energy_12w",       name: "Energy Saver 12W",          urdu: "انرجی سیور 12W",      icon: "💡", watt: 12,   category: "Lighting" },
  { id: "energy_18w",       name: "Energy Saver 18W",          urdu: "انرجی سیور 18W",      icon: "💡", watt: 18,   category: "Lighting" },
  { id: "energy_25w",       name: "Energy Saver 25W",          urdu: "انرجی سیور 25W",      icon: "💡", watt: 25,   category: "Lighting" },
  { id: "downlight",        name: "Downlight",                 urdu: "ڈاؤن لائٹ",          icon: "💡", watt: 8,    category: "Lighting" },
  { id: "fridge_single",    name: "Fridge (Single Door)",      urdu: "فریج ایک دروازہ",     icon: "🧊", watt: 150,  category: "Kitchen" },
  { id: "fridge_double",    name: "Fridge (Double Door)",      urdu: "فریج دو دروازے",      icon: "🧊", watt: 250,  category: "Kitchen" },
  { id: "fridge_inverter",  name: "Fridge (Inverter)",         urdu: "فریج انورٹر",         icon: "🧊", watt: 350,  category: "Kitchen" },
  { id: "deep_freezer",     name: "Deep Freezer",              urdu: "ڈیپ فریزر",           icon: "🧊", watt: 300,  category: "Kitchen" },
  { id: "microwave",        name: "Microwave Oven",            urdu: "مائیکروویو",          icon: "📦", watt: 1200, category: "Kitchen" },
  { id: "kettle",           name: "Electric Kettle",           urdu: "الیکٹرک کیتلی",       icon: "☕", watt: 1500, category: "Kitchen" },
  { id: "blender",          name: "Blender / Juicer",          urdu: "بلینڈر",              icon: "🥤", watt: 400,  category: "Kitchen" },
  { id: "washing_machine",  name: "Washing Machine",           urdu: "واشنگ مشین",          icon: "🫧", watt: 500,  category: "Appliances" },
  { id: "iron_plastic",     name: "Iron (Plastic/Light)",      urdu: "استری پلاسٹک",        icon: "👔", watt: 750,  category: "Appliances" },
  { id: "iron_metal",       name: "Iron (Metal/Heavy)",        urdu: "استری دھاتی",         icon: "👔", watt: 1200, category: "Appliances" },
  { id: "geyser",           name: "Geyser / Water Heater",     urdu: "گیزر",                icon: "🚿", watt: 3000, category: "Appliances" },
  { id: "heater",           name: "Electric Heater",           urdu: "الیکٹرک ہیٹر",        icon: "🔥", watt: 2000, category: "Appliances" },
  { id: "motor_half",       name: "Water Motor 0.5 HP",        urdu: "واٹر موٹر 0.5HP",     icon: "💧", watt: 373,  category: "Appliances" },
  { id: "motor_1hp",        name: "Water Motor 1 HP",          urdu: "واٹر موٹر 1HP",       icon: "💧", watt: 746,  category: "Appliances" },
  { id: "motor_15hp",       name: "Water Motor 1.5 HP",        urdu: "واٹر موٹر 1.5HP",     icon: "💧", watt: 1119, category: "Appliances" },
  { id: "dispenser",        name: "Water Dispenser",           urdu: "واٹر ڈسپینسر",        icon: "🚰", watt: 500,  category: "Appliances" },
  { id: "tv_32",            name: 'LED TV 32"',                urdu: 'LED ٹی وی 32"',        icon: "📺", watt: 50,   category: "Entertainment" },
  { id: "tv_43",            name: 'LED TV 43"',                urdu: 'LED ٹی وی 43"',        icon: "📺", watt: 80,   category: "Entertainment" },
  { id: "tv_55",            name: 'LED TV 55"',                urdu: 'LED ٹی وی 55"',        icon: "📺", watt: 120,  category: "Entertainment" },
  { id: "desktop",          name: "Desktop PC + Monitor",      urdu: "ڈیسک ٹاپ",            icon: "🖥️", watt: 300,  category: "Entertainment" },
  { id: "laptop",           name: "Laptop",                    urdu: "لیپ ٹاپ",             icon: "💻", watt: 65,   category: "Entertainment" },
  { id: "router",           name: "WiFi Router",               urdu: "وائی فائی روٹر",      icon: "📡", watt: 10,   category: "Entertainment" },
];

const CITIES = {
  Karachi:    { urdu: "کراچی",      sunHours: 5.5, markets: ["رنچھوڑ لائن سولر مارکیٹ","شیرشاہ مارکیٹ","لکی اسٹار مارکیٹ","لائٹلی مارکیٹ"] },
  Lahore:     { urdu: "لاہور",      sunHours: 4.8, markets: ["ہال روڈ سولر مارکیٹ","میکلوڈ روڈ","برانڈریتھ روڈ","اکبر چوک سولر ہب"] },
  Islamabad:  { urdu: "اسلام آباد", sunHours: 4.5, markets: ["راولپنڈی صدر مارکیٹ","ایف-10 مرکز","بلیو ایریا سولر شاپس"] },
  Multan:     { urdu: "ملتان",      sunHours: 5.2, markets: ["چوک گھنٹہ گھر","حسین آگاہی مارکیٹ"] },
  Peshawar:   { urdu: "پشاور",      sunHours: 4.6, markets: ["قصہ خوانی بازار","جی ٹی روڈ مارکیٹ"] },
  Faisalabad: { urdu: "فیصل آباد", sunHours: 4.9, markets: ["گھنٹہ گھر مارکیٹ","لائل پور بازار"] },
};

const BILL_BRACKETS = [
  { label: "PKR 3,000–5,000",   min: 3000,  max: 5000,  units: 80,  sysKw: 1.5 },
  { label: "PKR 5,000–8,000",   min: 5000,  max: 8000,  units: 130, sysKw: 2.5 },
  { label: "PKR 8,000–12,000",  min: 8000,  max: 12000, units: 200, sysKw: 3.0 },
  { label: "PKR 12,000–18,000", min: 12000, max: 18000, units: 300, sysKw: 5.0 },
  { label: "PKR 18,000–25,000", min: 18000, max: 25000, units: 420, sysKw: 7.0 },
  { label: "PKR 25,000–35,000", min: 25000, max: 35000, units: 580, sysKw: 10.0 },
  { label: "PKR 35,000+",       min: 35000, max: 99999, units: 800, sysKw: 15.0 },
];

const RATE = 50;

// ─── ENGINE ────────────────────────────────────────────────────────────────────

function calcFromApps(list) {
  const watts = list.reduce((s,a) => s + a.watt * a.qty, 0);
  const daily = list.reduce((s,a) => s + a.watt * a.qty * a.hours / 1000, 0);
  const monthly = daily * 30;
  const sys = Math.ceil((daily / 4.5) * 1.25 * 10) / 10;
  const batKwh = daily * 0.4;
  const peak = watts / 1000;
  const backupH = peak > 0 ? batKwh / (peak * 0.6) : 0;
  return { watts, daily, monthly, sys, batKwh, backupH, peak };
}

function calcFromBill(bill) {
  const b = BILL_BRACKETS.find(x => bill >= x.min && bill <= x.max) || BILL_BRACKETS[6];
  const daily = b.units / 30;
  const sys = b.sysKw;
  const batKwh = daily * 0.4;
  const peak = sys * 0.7;
  return { watts: peak * 1000, daily, monthly: b.units, sys, batKwh, backupH: batKwh/(peak*0.6), peak };
}

// ─── REAL PAKISTANI MARKET BRANDS 2026 ────────────────────────────────────────
const INV = {
  // Budget: local/cheap brands
  itel:     { name:"Itel Solar",      model:"ITS-3K Hybrid",    pricePerKw:10000, warranty:"2 saal", note:"Sab se sasta, basic use" },
  zewnic:   { name:"Zewnic",          model:"ZX Hybrid 3KW",    pricePerKw:11000, warranty:"2 saal", note:"Budget Chinese brand" },
  fronx:    { name:"Fronx Solar",     model:"FX-3000 Hybrid",   pricePerKw:11500, warranty:"2 saal", note:"Local Pakistani brand" },
  phonosolar:{ name:"Phonosolar",     model:"PSI-3K Hybrid",    pricePerKw:12000, warranty:"2 saal", note:"Budget hybrid option" },
  axpert:   { name:"Voltronic/Axpert",model:"MKS 5K Plus",      pricePerKw:10500, warranty:"2 saal", note:"Popular UPS-style, widely available" },
  // Mid: reliable brands
  inverex:  { name:"Inverex",         model:"Nitrox 5KW",       pricePerKw:16000, warranty:"5 saal", note:"Pakistan #1 local brand, best after-sales" },
  solis:    { name:"Solis",           model:"S6-EH1P 5K",       pricePerKw:15000, warranty:"5 saal", note:"Global Tier-1, acha value" },
  growatt:  { name:"Growatt",         model:"SPH5000TL3-BH",    pricePerKw:14500, warranty:"5 saal", note:"Reliable Chinese Tier-1" },
  infini:   { name:"Infini Solar",    model:"V-5KW Plus",       pricePerKw:15500, warranty:"5 saal", note:"Popular Karachi/Lahore mein" },
  must:     { name:"Must Solar",      model:"PH18-5048 MAX",    pricePerKw:13500, warranty:"3 saal", note:"Good mid-range value" },
  pvtech:   { name:"PV-Tech",         model:"PVT-5K Hybrid",    pricePerKw:14000, warranty:"3 saal", note:"Local assembly, good support" },
  // Premium
  huawei:   { name:"Huawei",          model:"SUN2000-10KTL",    pricePerKw:22000, warranty:"10 saal",note:"AI monitoring, best smart features" },
  deye:     { name:"Deye",            model:"SUN-10K-SG04LP3",  pricePerKw:20000, warranty:"10 saal",note:"Fast growing premium brand" },
  sma:      { name:"SMA Solar",       model:"Sunny Boy 10.0",   pricePerKw:28000, warranty:"10 saal",note:"German engineering, top quality" },
  victron:  { name:"Victron Energy",  model:"MultiPlus-II 10K", pricePerKw:35000, warranty:"5 saal", note:"Best for off-grid & backup" },
};

function buildPkgs(c) {
  const panels = Math.ceil(c.sys * 1000 / 550);
  const inv = Math.max(3, Math.ceil(c.sys / 3) * 3);
  const tb = Math.max(1, Math.ceil(c.batKwh / 1.2));
  const lb = Math.max(1, Math.ceil(c.batKwh / 3.5));
  return {
    budget: {
      label:"Sasta Package", tag:"Kam Budget Walo Ke Liye", color:"#f59e0b",
      panels:  { qty:panels, brand:"JA Solar",    model:"JAM72S30 550W",  cost:panels*550*24 },
      inverter:{ kw:inv, ...INV.itel,   cost:inv*INV.itel.pricePerKw },
      battery: { qty:tb, brand:"Osaka Tubular", type:"Lead Acid", cost:tb*28000 },
      struct:panels*2500, wire:30000, prot:12000, inst:22000,
    },
    value: {
      label:"Best Value ⭐", tag:"Sabse Behtareen Choice", color:"#10b981",
      panels:  { qty:panels, brand:"Jinko Solar", model:"Tiger Neo 550W", cost:panels*550*26 },
      inverter:{ kw:inv, ...INV.inverex, cost:inv*INV.inverex.pricePerKw },
      battery: { qty:tb, brand:"AGS Sonic", type:"Lead Acid", cost:tb*32000 },
      struct:panels*3000, wire:42000, prot:18000, inst:28000,
    },
    premium: {
      label:"Premium Package", tag:"25+ Saal Ki Guarantee", color:"#6366f1",
      panels:  { qty:panels, brand:"Longi Solar",  model:"Hi-MO 6 580W Bifacial", cost:panels*580*30 },
      inverter:{ kw:inv, ...INV.huawei, cost:inv*INV.huawei.pricePerKw },
      battery: { qty:lb, brand:"Pylontech US3000", type:"LiFePO4 Lithium", cost:lb*95000 },
      struct:panels*4000, wire:58000, prot:28000, inst:38000,
    },
  };
}

function total(p) { return p.panels.cost + p.inverter.cost + p.battery.cost + p.struct + p.wire + p.prot + p.inst; }
function roiCalc(t, monthly) { const m = monthly*RATE+500; return { monthly: m, years: t/(m*12), net25: m*12*25-t }; }

// ─── COMPONENTS ────────────────────────────────────────────────────────────────

function WaBtn() {
  return (
    <a href="https://wa.me/923001234567?text=Assalam%20o%20Alaikum!%20Mujhe%20free%20solar%20quote%20chahiye." target="_blank" rel="noreferrer"
      className="fixed bottom-6 right-5 z-50 w-16 h-16 bg-green-500 hover:bg-green-400 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110">
      <svg viewBox="0 0 32 32" fill="white" className="w-9 h-9"><path d="M16 3C9 3 3 9 3 16c0 2.4.6 4.7 1.8 6.7L3 29l6.5-1.7C11.4 28.4 13.7 29 16 29c7 0 13-6 13-13S23 3 16 3zm6.5 18.2c-.3.8-1.5 1.5-2 1.6-.5.1-1.2.1-3.8-1.1-3.2-1.4-5.2-4.7-5.4-4.9-.2-.2-1.3-1.8-1.3-3.4 0-1.6.9-2.4 1.2-2.7.3-.3.7-.4 1-.4h.7c.2 0 .5 0 .8.6.3.7 1 2.4 1.1 2.6.1.2.2.5 0 .8-.2.3-.3.5-.5.7-.2.2-.4.5-.2.9.2.4.9 1.6 2 2.5 1.4 1.1 2.5 1.4 2.9 1.6.4.1.6 0 .9-.2.3-.3.7-.8 1-1.1.3-.3.6-.2.9-.1l2.5 1.2c.3.1.5.2.6.4.1.2.1 1-.2 1.9z"/></svg>
    </a>
  );
}

function AIAdvisor({ c, pkgs, city }) {
  const [txt, setTxt] = useState(""); const [loading, setLoading] = useState(false);
  const ask = async () => {
    setLoading(true); setTxt("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{ role:"user", content:
          `Tum SolarWise Pakistan ke expert ho. Roman Urdu mein simple 4 bullet points (• se) mein batao:\n1. ${city} ke liye konsa package best hai aur kyun\n2. ${city} mein solar ki khas tip\n3. Net metering ke baare mein ek practical tip\n4. B-grade panels se kaise bachen\n\nLoad: ${c.sys}kW, Monthly: ${c.monthly.toFixed(0)} kWh\nBudget PKR ${total(pkgs.budget).toLocaleString()}, Value PKR ${total(pkgs.value).toLocaleString()}, Premium PKR ${total(pkgs.premium).toLocaleString()}\n\nSeedhi simple zaban, jaise dost ko samjha rahe ho.` }] })
      });
      const d = await res.json();
      setTxt(d.content?.map(b=>b.text||"").join("")||"");
    } catch { setTxt(`• Is load ke liye Best Value package sahi hai — reliable brands, reasonable price.\n• ${city} mein saal mein ${CITIES[city]?.sunHours||5} ghante sun milti hai, system acha karega.\n• NEPRA net metering ke liye apne DISCO se form lein — bill zero ho sakta hai.\n• Sirf Tier-1 panels lein, original hologram warranty card zaroor check karein.`); }
    setLoading(false);
  };
  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-2xl shadow">🤖</div>
          <div><div className="font-black text-gray-900">SolarWise AI Advisor</div><div className="text-xs text-emerald-600 font-semibold">Aapke liye personalized advice</div></div>
        </div>
        <button onClick={ask} disabled={loading} className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-sm font-black shadow transition-all flex items-center gap-2">
          {loading ? <span className="animate-spin">⟳</span> : "✨"}{loading ? "Soch raha hoon..." : "AI Advice Lo"}
        </button>
      </div>
      {txt ? <div className="bg-white rounded-xl p-4 border border-emerald-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line shadow-sm">{txt}</div>
           : <div className="text-center py-3 text-gray-400 text-sm">Button dabao — {city} ke liye personalized advice milegi 🌟</div>}
    </div>
  );
}

function PkgCard({ p, c, isRec, onWa }) {
  const t = total(p); const { monthly, years, net25 } = roiCalc(t, c.monthly);
  return (
    <div className={`relative rounded-2xl border-2 p-5 shadow transition-all ${isRec ? "border-emerald-400 bg-emerald-50 scale-[1.02] shadow-xl" : "border-gray-200 bg-white shadow-md"}`}>
      {isRec && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-black px-5 py-1.5 rounded-full shadow-lg">⭐ SABSE BEHTAREEN</div>}
      <div className="flex items-center gap-2 mt-2 mb-1"><div className="w-4 h-4 rounded-full" style={{background:p.color}}/><h3 className="font-black text-gray-900 text-xl">{p.label}</h3></div>
      <div className="text-xs font-bold mb-4" style={{color:p.color}}>{p.tag}</div>
      <div className="text-4xl font-black text-gray-900 mb-1">PKR {(t/1000).toFixed(0)}K</div>
      <div className="text-xs text-gray-400 mb-5">≈ USD {(t/278).toFixed(0)}</div>
      <div className="space-y-2.5 mb-5">
        {[["☀️ Panels",`${p.panels.qty}× ${p.panels.brand}`],["⚡ Inverter",`${p.inverter.kw}kW ${p.inverter.brand}`],["🔋 Battery",`${p.battery.qty}× ${p.battery.brand}`],["💰 Mahinay Bachat",`PKR ${monthly.toLocaleString()}`,"text-emerald-600"],["📅 Payback",`${years.toFixed(1)} saal`,"text-amber-600"],["🏆 25yr Faida",`PKR ${(net25/1000000).toFixed(1)}M`,"text-indigo-600"]].map(([l,v,cls])=>(
          <div key={l} className="flex justify-between text-sm border-b border-gray-100 pb-1.5"><span className="text-gray-500">{l}</span><span className={`font-bold ${cls||"text-gray-900"}`}>{v}</span></div>
        ))}
      </div>
      {net25>0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-4 text-center text-xs text-amber-700 font-bold">🚗 25 saal mein {net25>=3000000?`${Math.floor(net25/3000000)} gari khareed sakte hain!`:`PKR ${(net25/1000000).toFixed(1)}M ki bachat!`}</div>}
      <button onClick={()=>onWa(p,t)} className={`w-full py-3.5 rounded-xl font-black text-sm transition-all shadow ${isRec?"bg-emerald-500 hover:bg-emerald-600 text-white":"bg-gray-100 hover:bg-gray-200 text-gray-800"}`}>📱 WhatsApp pe Quote Lo</button>
    </div>
  );
}

function AppPicker({ onAdd }) {
  const [qty, setQty] = useState({}); const [hrs, setHrs] = useState({}); const [cat, setCat] = useState("All"); const [search, setSearch] = useState("");
  const cats = ["All","Cooling","Lighting","Kitchen","Appliances","Entertainment"];
  const catUr = {All:"سب",Cooling:"ٹھنڈک",Lighting:"روشنی",Kitchen:"باورچی خانہ",Appliances:"آلات",Entertainment:"تفریح"};
  const shown = APPLIANCES.filter(a=>(cat==="All"||a.category===cat)&&(search===""||a.name.toLowerCase().includes(search.toLowerCase())||a.urdu.includes(search)));
  const gq = id=>qty[id]??1; const gh = id=>hrs[id]??8;
  return (
    <div>
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Appliance dhundein... fan, AC, fridge"
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-400 focus:outline-none text-sm text-gray-800 bg-white" />
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all border-2 ${cat===c?"bg-emerald-500 border-emerald-500 text-white shadow":"bg-white border-gray-200 text-gray-600 hover:border-emerald-300"}`}>{catUr[c]||c}</button>)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shown.map(a=>(
          <div key={a.id} className="bg-white border-2 border-gray-100 hover:border-emerald-300 rounded-2xl p-4 transition-all shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <div className="font-bold text-gray-900 text-sm leading-tight">{a.name}</div>
                  <div className="text-xs text-gray-400" style={{fontFamily:"serif",direction:"rtl"}}>{a.urdu}</div>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">{a.watt}W</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Tadaad</div>
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={()=>setQty(q=>({...q,[a.id]:Math.max(1,gq(a.id)-1)}))} className="px-3 py-2 text-gray-500 hover:bg-gray-100 font-bold text-lg leading-none">−</button>
                  <div className="flex-1 text-center font-bold text-gray-900 text-sm">{gq(a.id)}</div>
                  <button onClick={()=>setQty(q=>({...q,[a.id]:Math.min(20,gq(a.id)+1)}))} className="px-3 py-2 text-gray-500 hover:bg-gray-100 font-bold text-lg leading-none">+</button>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-gray-400 mb-1">Ghante/Din</div>
                <input type="number" min="0.5" max="24" step="0.5" value={gh(a.id)} onChange={e=>setHrs(h=>({...h,[a.id]:+e.target.value}))}
                  className="w-full border-2 border-gray-200 rounded-xl px-2 py-2 text-center text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-400" />
              </div>
              <button onClick={()=>onAdd({...a,qty:gq(a.id),hours:gh(a.id)})} className="mt-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-3 py-2 text-sm font-black transition-colors shadow">+ Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VOICE AGENT ───────────────────────────────────────────────────────────────

function VoiceAgent({ city, onResult }) {
  const [state, setState] = useState("idle"); // idle | listening | thinking | speaking | done
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);
  const [agentText, setAgentText] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [open, setOpen] = useState(false);
  const recogRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const conversationRef = useRef([]);

  // Detect language — Urdu script ya Roman Urdu ya English
  const detectLang = (text) => {
    const urduScript = /[\u0600-\u06FF]/;
    const urduWords = /\b(mera|mere|hai|hain|ghar|main|aur|ka|ki|ke|mein|fan|bijli|load|shedding|ghante|nahi|haan|ek|do|teen|char|paanch|kitna|kya|bhi|watt|solar|inverter|battery)\b/i;
    if (urduScript.test(text)) return "ur";
    if (urduWords.test(text)) return "roman-ur";
    return "en";
  };

  const speak = (text, lang) => {
    synthRef.current.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    // Pick voice based on language
    const voices = synthRef.current.getVoices();
    if (lang === "ur") {
      const urVoice = voices.find(v => v.lang.startsWith("ur")) || voices.find(v => v.lang.startsWith("hi")) || null;
      if (urVoice) utter.voice = urVoice;
      utter.lang = "ur-PK";
    } else {
      const enVoice = voices.find(v => v.lang.startsWith("en")) || null;
      if (enVoice) utter.voice = enVoice;
      utter.lang = "en-US";
    }
    utter.rate = 0.92;
    utter.pitch = 1.05;
    utter.onend = () => setState("idle");
    synthRef.current.speak(utter);
    setState("speaking");
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Aapka browser voice support nahi karta. Chrome use karein.");
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = "ur-PK"; // accepts both Urdu & English in most browsers
    recog.onstart = () => setState("listening");
    recog.onresult = (e) => {
      const txt = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(txt);
    };
    recog.onend = () => {
      setState("thinking");
      handleUserSpeech(transcript || "");
    };
    recog.onerror = () => setState("idle");
    recogRef.current = recog;
    recog.start();
  };

  const stopListening = () => {
    recogRef.current?.stop();
  };

  const handleUserSpeech = async (userText) => {
    if (!userText.trim()) { setState("idle"); return; }
    const lang = detectLang(userText);
    const newMsg = { role: "user", content: userText };
    const updatedConv = [...conversationRef.current, newMsg];
    conversationRef.current = updatedConv;
    setMessages(prev => [...prev, { from: "user", text: userText, lang }]);

    try {
      const systemPrompt = `You are SolarWise AI — a friendly, expert solar energy voice assistant for Pakistan. 

RULES:
1. LANGUAGE MIRROR: If user speaks Urdu script → reply in Urdu. If Roman Urdu → reply in Roman Urdu. If English → reply in English. Never mix unless user mixes.
2. CONVERSATION GOAL: Collect from user through natural conversation:
   - Their appliances (fans, AC, fridge etc.) with quantities
   - Daily usage hours for each
   - Load shedding hours per day
   - Their city (if not already known: ${city})
3. Ask ONE thing at a time — don't overwhelm.
4. When you have enough info, output EXACTLY this JSON block at end of your reply (hidden from speech):
   ###JSON###{"apps":[{"id":"fan_ceiling_ac","qty":4,"hours":18},...],"loadSheddingHours":8,"city":"${city}"}###END###
5. Keep voice replies SHORT (2-3 sentences max) — this is spoken audio.
6. Be warm, friendly, like a helpful Pakistani dost.
7. Current city context: ${city}

Appliance IDs to use: fan_ceiling_ac(75W), fan_ceiling_dc(28W), fan_ceiling_acdc(35W), fan_table_ac(50W), ac_1ton(1500W), ac_15ton(2000W), ac_2ton(2500W), ac_1ton_inv(900W), ac_15ton_inv(1300W), ac_2ton_inv(1700W), air_cooler(200W), led_7w(7W), led_10w(10W), energy_12w(12W), energy_18w(18W), energy_25w(25W), fridge_single(150W), fridge_double(250W), fridge_inverter(350W), deep_freezer(300W), microwave(1200W), washing_machine(500W), iron_plastic(750W), iron_metal(1200W), geyser(3000W), motor_half(373W), motor_1hp(746W), tv_32(50W), tv_43(80W), tv_55(120W), laptop(65W), desktop(300W), router(10W)`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: systemPrompt,
          messages: updatedConv,
        }),
      });
      const data = await res.json();
      const fullReply = data.content?.map(b => b.text || "").join("") || "";

      // Extract JSON if present
      const jsonMatch = fullReply.match(/###JSON###([\s\S]*?)###END###/);
      let spokenReply = fullReply.replace(/###JSON###[\s\S]*?###END###/g, "").trim();

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1].trim());
          setExtractedData(parsed);
          setState("done");
          setAgentText(spokenReply);
          setMessages(prev => [...prev, { from: "agent", text: spokenReply, lang }]);
          conversationRef.current = [...updatedConv, { role: "assistant", content: spokenReply }];
          speak(spokenReply, lang);
          // Auto-trigger result after 1.5s
          setTimeout(() => {
            if (parsed.apps?.length > 0) {
              const appList = parsed.apps.map(a => {
                const found = APPLIANCES.find(x => x.id === a.id);
                return found ? { ...found, qty: a.qty || 1, hours: a.hours || 8 } : null;
              }).filter(Boolean);
              if (appList.length > 0) onResult(appList, parsed.loadSheddingHours || 0, parsed.city || city);
            }
          }, 1800);
          return;
        } catch (e) { /* continue */ }
      }

      // Normal conversation turn
      setAgentText(spokenReply);
      setMessages(prev => [...prev, { from: "agent", text: spokenReply, lang }]);
      conversationRef.current = [...updatedConv, { role: "assistant", content: spokenReply }];
      speak(spokenReply, lang);

    } catch {
      const fallback = lang === "en"
        ? "Sorry, there was an error. Please try again."
        : "Maafi chahta hoon, koi masla aaya. Dobara koshish karein.";
      setAgentText(fallback);
      setMessages(prev => [...prev, { from: "agent", text: fallback, lang }]);
      speak(fallback, lang);
    }
  };

  const reset = () => {
    conversationRef.current = [];
    setMessages([]);
    setTranscript("");
    setAgentText("");
    setExtractedData(null);
    setState("idle");
    synthRef.current.cancel();
  };

  const greet = () => {
    reset();
    setOpen(true);
    setTimeout(() => {
      const greeting = `Assalam o Alaikum! Main SolarWise AI hoon. Apne ghar ke appliances batayein — jaise kitne fans hain, AC hai ya nahi, fridge, aur load shedding kitne ghante hoti hai. Main khud calculate kar ke bata dunga!`;
      setAgentText(greeting);
      setMessages([{ from: "agent", text: greeting, lang: "roman-ur" }]);
      speak(greeting, "roman-ur");
    }, 300);
  };

  if (!open) return (
    <button onClick={greet}
      className="fixed bottom-24 right-5 z-50 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-3 rounded-2xl shadow-2xl font-black text-sm transition-all hover:scale-105 animate-bounce"
      title="Voice Agent — Bol ke calculate karo!">
      <span className="text-xl">🎙️</span>
      <span>Voice Agent</span>
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">AI</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
                🤖
                {(state === "listening" || state === "speaking") && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                )}
              </div>
              <div>
                <div className="font-black text-white text-lg">SolarWise Voice AI</div>
                <div className="text-xs text-indigo-200 font-semibold">
                  {state === "idle" && "Baat karne ke liye tayaar"}
                  {state === "listening" && "🔴 Sun raha hoon..."}
                  {state === "thinking" && "🤔 Soch raha hoon..."}
                  {state === "speaking" && "🔊 Bol raha hoon..."}
                  {state === "done" && "✅ Calculation complete!"}
                </div>
              </div>
            </div>
            <button onClick={() => { setOpen(false); reset(); synthRef.current.cancel(); }}
              className="text-white/70 hover:text-white text-2xl font-bold w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/20">✕</button>
          </div>
        </div>

        {/* Chat messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              <div className="text-4xl mb-2">🎙️</div>
              Mic button dabao aur baat karo...
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.from === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-white border-2 border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"}`}>
                {m.from === "agent" && <div className="text-xs text-indigo-500 font-bold mb-1">🤖 SolarWise AI</div>}
                {m.from === "user" && <div className="text-xs text-indigo-200 font-bold mb-1">👤 Aap</div>}
                {m.text}
              </div>
            </div>
          ))}
          {state === "thinking" && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay:`${i*0.15}s`}}/>)}
                  <span className="text-xs text-gray-400 ml-2">Calculate kar raha hoon...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transcript preview */}
        {state === "listening" && transcript && (
          <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100">
            <div className="text-xs text-indigo-600 font-bold mb-1">🎤 Aap bol rahe hain:</div>
            <div className="text-sm text-gray-700 italic">"{transcript}"</div>
          </div>
        )}

        {/* Waveform animation while listening */}
        {state === "listening" && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-100 flex items-center justify-center gap-1">
            {Array.from({length:12}).map((_,i) => (
              <div key={i} className="w-1.5 bg-red-400 rounded-full animate-pulse"
                style={{height:`${8 + Math.sin(i*0.8)*8}px`, animationDelay:`${i*0.07}s`}}/>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="p-4 bg-white border-t-2 border-gray-100">
          {state === "done" && extractedData ? (
            <div className="text-center">
              <div className="text-sm text-emerald-600 font-black mb-3">✅ Load collect ho gaya! Result load ho raha hai...</div>
              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{width:"80%"}}/></div>
            </div>
          ) : (
            <div className="flex gap-3">
              {/* Main mic button */}
              <button
                onClick={state === "listening" ? stopListening : startListening}
                disabled={state === "thinking" || state === "speaking"}
                className={`flex-1 py-4 rounded-2xl font-black text-white text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${state === "listening" ? "bg-red-500 hover:bg-red-600 animate-pulse" : state === "thinking" || state === "speaking" ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-105"}`}>
                <span className="text-xl">{state === "listening" ? "⏹️" : state === "speaking" ? "🔊" : "🎙️"}</span>
                {state === "listening" ? "Rok do (Tap)" : state === "thinking" ? "Soch raha hoon..." : state === "speaking" ? "Bol raha hoon..." : "Mic Dabao — Bolo!"}
              </button>
              {/* Reset */}
              <button onClick={reset} className="w-12 h-14 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl transition-all" title="Reset">🔄</button>
            </div>
          )}

          {/* Language hint */}
          <div className="flex justify-center gap-3 mt-3">
            {[["🇵🇰","Urdu mein bolein"],["🇬🇧","Or English mein"]].map(([f,t])=>(
              <div key={t} className="flex items-center gap-1 text-xs text-gray-400"><span>{f}</span><span>{t}</span></div>
            ))}
          </div>

          {/* Type fallback */}
          <div className="mt-3 flex gap-2">
            <input
              placeholder="Ya yahan type karein..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
              onKeyDown={e => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  const t = e.target.value.trim();
                  e.target.value = "";
                  setTranscript(t);
                  setState("thinking");
                  handleUserSpeech(t);
                }
              }}
            />
            <button
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-xl text-sm font-bold"
              onClick={e => {
                const inp = e.target.parentNode.querySelector("input");
                if (inp?.value.trim()) {
                  const t = inp.value.trim(); inp.value = "";
                  setTranscript(t); setState("thinking"); handleUserSpeech(t);
                }
              }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [mode, setMode] = useState(null);
  const [city, setCity] = useState("Karachi");
  const [bill, setBill] = useState("");
  const [apps, setApps] = useState([]);
  const [c, setC] = useState(null);
  const [pkgs, setPkgs] = useState(null);
  const [rtab, setRtab] = useState("packages");
  const [counter] = useState(47832 + Math.floor(Math.random()*200));
  const [leadName, setLeadName] = useState(""); const [leadPhone, setLeadPhone] = useState(""); const [leadDone, setLeadDone] = useState(false);

  const addApp = useCallback(a=>{ setApps(prev=>{ const i=prev.findIndex(x=>x.id===a.id); if(i>=0){const n=[...prev];n[i]=a;return n;} return [...prev,a]; }); },[]);

  const go = () => {
    const calc = mode==="bill" ? calcFromBill(+bill) : calcFromApps(apps);
    setC(calc); setPkgs(buildPkgs(calc)); setPage("result");
  };

  // Voice agent callback — auto-fills apps and jumps to result
  const handleVoiceResult = useCallback((appList, loadSheddingHours, detectedCity) => {
    if (detectedCity && CITIES[detectedCity]) setCity(detectedCity);
    setApps(appList);
    setMode("appliances");
    const calc = calcFromApps(appList);
    // Add extra battery for load shedding hours
    if (loadSheddingHours > 0) {
      calc.batKwh = Math.max(calc.batKwh, (calc.peak * loadSheddingHours * 0.7));
      calc.backupH = loadSheddingHours;
    }
    setC(calc);
    setPkgs(buildPkgs(calc));
    setPage("result");
  }, []);

  const waQuote = (p,t) => {
    const msg=`Assalam o Alaikum! Mujhe *${p.label}* mein interest hai.\n\n☀️ System: ${c.sys}kW\n📦 Panels: ${p.panels.qty}× ${p.panels.brand}\n⚡ Inverter: ${p.inverter.kw}kW ${p.inverter.brand}\n🔋 Battery: ${p.battery.qty}× ${p.battery.brand}\n💰 Total: PKR ${t.toLocaleString()}\n📍 City: ${city}\n\nPlease quote dein.`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`,"_blank");
  };

  const PIE_COLORS=["#10b981","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4"];
  const monthlyChart = c ? Array.from({length:12},(_,i)=>({
    m:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    Solar:+(c.sys*[4.2,4.5,4.8,5.0,5.3,5.5,5.1,4.9,5.0,4.8,4.4,4.1][i]*30).toFixed(0),
    Kharch:+(c.daily*[1.0,1.0,1.1,1.2,1.4,1.5,1.5,1.4,1.2,1.0,0.9,0.9][i]*30).toFixed(0),
  })) : [];
  const pieData = apps.length>0 ? Object.entries(apps.reduce((a,x)=>{a[x.category]=(a[x.category]||0)+x.watt*x.qty*x.hours/1000;return a;},{})).map(([n,v])=>({name:n,value:+v.toFixed(1)})) : [];

  const FONT = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');`;

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (page==="home") return (
    <div className="min-h-screen bg-white" style={{fontFamily:"'Outfit',sans-serif"}}>
      <style>{FONT}</style>
      <WaBtn/>
      <VoiceAgent city={city} onResult={handleVoiceResult} />
      <nav className="sticky top-0 z-40 bg-white/96 backdrop-blur border-b-2 border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-xl shadow">☀️</div>
            <div><div className="font-black text-gray-900 text-lg leading-none">SolarWise</div><div className="text-xs text-emerald-600 font-bold">Pakistan 🇵🇰</div></div>
          </div>
          <div className="flex items-center gap-2">
            <select value={city} onChange={e=>setCity(e.target.value)} className="text-sm border-2 border-gray-200 rounded-xl px-3 py-2 font-bold text-gray-700 focus:outline-none focus:border-emerald-400 bg-white">
              {Object.keys(CITIES).map(c=><option key={c}>{c}</option>)}
            </select>
            <button onClick={()=>setPage("mode")} className="hidden sm:block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-black shadow">🚀 Shuru Karein</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-700 to-teal-700 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"/>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-300/20 rounded-full blur-2xl"/>
        <div className="relative max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm font-bold mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"/>
            {counter.toLocaleString()} Pakistaniyon ne abhi tak calculate kiya
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-4 leading-tight">
            Bijli Bill Se<br/><span className="text-yellow-300">Hamesha Ke Liye</span><br/>Chhutkara Pao!
          </h1>
          <p className="text-white/80 text-lg mb-3 max-w-xl mx-auto">2 minute mein apna solar system calculate karo.<br/><span className="font-bold text-white">2026 Real Pakistani Market Prices.</span></p>
          <div className="inline-block bg-red-500/30 border border-red-300/50 rounded-2xl px-6 py-3 mb-8 text-sm font-bold">😤 Kya aapka bijli bill PKR 15,000+ aa raha hai? Solar se sirf PKR 2,000 reh jayega!</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>setPage("mode")} className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-2xl text-lg font-black shadow-2xl transition-all hover:scale-105">☀️ Free Calculate Karo →</button>
            <button onClick={()=>window.open("https://wa.me/923001234567?text=Mujhe%20free%20solar%20consultation%20chahiye","_blank")} className="bg-white/20 hover:bg-white/30 border-2 border-white/40 text-white px-8 py-4 rounded-2xl text-lg font-black">📱 WhatsApp Karo</button>
          </div>
          {/* Voice Agent CTA */}
          <div className="mt-5 flex justify-center">
            <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg animate-pulse">🎙️</div>
              <div className="text-left">
                <div className="font-black text-white text-sm">Baat kar ke calculate karo!</div>
                <div className="text-white/70 text-xs">Voice Agent ko apna load batao — woh khud calculate karega</div>
              </div>
              <div className="bg-indigo-500 text-white text-xs font-black px-3 py-1 rounded-full">NEW ✨</div>
            </div>
          </div>
        </div>
      </div>

      {/* TRUST */}
      <div className="bg-gray-50 border-y-2 border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap justify-center gap-3">
          {[["🏆","Pakistan #1 Solar Calculator"],["✅","AEDB Approved Brands"],["💰","2026 Real Prices"],["🔒","B-grade Se Protection"],["📱","Free WhatsApp Support"],["⚡","NEPRA Net Metering Guide"]].map(([ic,tx])=>(
            <div key={tx} className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2"><span className="text-lg">{ic}</span><span className="text-xs font-bold text-emerald-800">{tx}</span></div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-2">Sirf 3 Asaan Qadam</div>
          <h2 className="text-3xl font-black text-gray-900">Kaise Kaam Karta Hai?</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[["🏙️","Sheher Chunein","Karachi, Lahore, Islamabad — sun hours automatic calculate honge"],["⚡","Load Darj Karein","Bill amount ya appliances add karein — jo aasaan lage"],["☀️","Solution Pao","3 packages with real prices, savings chart, aur WhatsApp quote"]].map(([ic,t,d],i)=>(
            <div key={t} className="text-center p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">{ic}</div>
              <div className="text-5xl font-black text-gray-100 leading-none mb-1">{i+1}</div>
              <div className="font-black text-gray-900 text-lg mb-2">{t}</div>
              <div className="text-sm text-gray-500">{d}</div>
            </div>
          ))}
        </div>
        <div className="text-center"><button onClick={()=>setPage("mode")} className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl text-lg font-black shadow-xl transition-all hover:scale-105">Abhi Calculate Karo — Bilkul Free! 🚀</button></div>
      </div>

      {/* NUMBERS */}
      <div className="bg-emerald-600 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-8">Solar Se Kitna Faida Hota Hai?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[["PKR 18,000","Avg Monthly Savings"],["4-5 Saal","Payback Period"],["PKR 5.4M","25 Saal Ki Bachat"],["25 Saal","Panel Warranty"]].map(([v,l])=>(
              <div key={l} className="bg-white/15 rounded-2xl p-5"><div className="text-3xl font-black text-yellow-300">{v}</div><div className="text-sm text-emerald-200 mt-1">{l}</div></div>
            ))}
          </div>
        </div>
      </div>

      {/* MARKETS */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10"><h2 className="text-3xl font-black text-gray-900">Trusted Markets</h2><p className="text-gray-500 mt-2">Genuine AEDB-verified dealers jahan se kharidein</p></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.entries(CITIES).slice(0,3).map(([ct,d])=>(
            <div key={ct} className={`rounded-2xl border-2 p-5 shadow-sm ${ct===city?"border-emerald-400 bg-emerald-50":"border-gray-200 bg-white"}`}>
              <div className="flex items-center gap-2 mb-3"><span className="text-2xl">🏙️</span><div><div className="font-black text-gray-900">{ct}</div><div className="text-xs text-emerald-600 font-bold">{d.urdu} · {d.sunHours}h ☀️</div></div></div>
              {d.markets.map(m=><div key={m} className="text-sm text-gray-600 flex gap-2 mb-1"><span className="text-emerald-500">📍</span>{m}</div>)}
            </div>
          ))}
        </div>
      </div>

      {/* LEAD FORM */}
      <div className="bg-gray-50 border-t-2 border-gray-100 py-14">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="text-4xl mb-3">📞</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Free Consultation Chahiye?</h2>
          <p className="text-gray-500 text-sm mb-6">Naam aur number dijiye — expert 24 ghante mein call karega</p>
          {leadDone ? (
            <div className="bg-emerald-100 border-2 border-emerald-300 rounded-2xl p-6"><div className="text-4xl mb-2">✅</div><div className="font-black text-emerald-700 text-lg">Shukriya! Jald call ayegi.</div></div>
          ) : (
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
              <input value={leadName} onChange={e=>setLeadName(e.target.value)} placeholder="Aapka Naam" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-400 font-medium"/>
              <input value={leadPhone} onChange={e=>setLeadPhone(e.target.value)} placeholder="Mobile Number" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-400 font-medium"/>
              <select value={city} onChange={e=>setCity(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-emerald-400 font-medium">
                {Object.keys(CITIES).map(ct=><option key={ct}>{ct}</option>)}
              </select>
              <button onClick={()=>{ if(leadName&&leadPhone){setLeadDone(true);window.open(`https://wa.me/923001234567?text=${encodeURIComponent(`Assalam o Alaikum! Main ${leadName}, ${city} se. Mobile: ${leadPhone}. Free solar consultation chahiye.`)}`,"_blank");}}} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-black transition-all shadow">🤝 Free Consultation Lo →</button>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-3"><div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-xl">☀️</div><span className="font-black text-xl">SolarWise Pakistan 🇵🇰</span></div>
        <div className="text-gray-400 text-sm mb-3">Pakistan ka #1 Solar Calculator — 2026 Edition</div>
        <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-400"><span>📧 info@solarwise.pk</span><span>📱 +92 300 123 4567</span><span>🌐 www.solarwise.pk</span></div>
        <div className="mt-3 text-xs text-gray-600">Prices indicative — multiple vendors se quote zaroor lein.</div>
      </footer>
    </div>
  );

  // ── MODE SELECT ───────────────────────────────────────────────────────────
  if (page==="mode") return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{fontFamily:"'Outfit',sans-serif"}}><style>{FONT}</style><WaBtn/><VoiceAgent city={city} onResult={handleVoiceResult}/>
      <div className="max-w-lg mx-auto w-full px-4 py-12">
        <button onClick={()=>setPage("home")} className="text-gray-400 text-sm mb-8 flex items-center gap-1 hover:text-gray-600">← Wapas Home</button>
        <div className="text-center mb-8"><div className="text-5xl mb-3">🏙️</div><h2 className="text-2xl font-black text-gray-900 mb-1">Pehle Sheher Chunein</h2><p className="text-gray-500 text-sm">Sun hours automatic set honge</p></div>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {Object.entries(CITIES).map(([ct,d])=>(
            <button key={ct} onClick={()=>setCity(ct)} className={`rounded-2xl border-2 p-3 text-center transition-all ${city===ct?"border-emerald-500 bg-emerald-50 shadow":"border-gray-200 bg-white hover:border-emerald-300"}`}>
              <div className="font-black text-gray-900 text-sm">{ct}</div><div className="text-xs text-emerald-600 font-bold">{d.sunHours}h ☀️</div>
            </button>
          ))}
        </div>
        <div className="text-center mb-5"><h2 className="text-xl font-black text-gray-900">Calculation Ka Tarika</h2></div>
        <div className="space-y-4">
          <button onClick={()=>{setMode("bill");setPage("bill");}} className="w-full bg-white border-2 border-emerald-400 rounded-2xl p-5 text-left hover:bg-emerald-50 transition-all shadow group">
            <div className="flex items-center gap-4"><div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow group-hover:scale-105 transition-transform">💡</div><div><div className="font-black text-gray-900 text-lg">Bijli Bill Se</div><div className="text-sm text-gray-500">Sirf bill amount likhein</div><div className="mt-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full inline-block">⚡ SABSE AASAAN — 30 Second!</div></div></div>
          </button>
          <button onClick={()=>{setMode("appliances");setPage("appliances");}} className="w-full bg-white border-2 border-gray-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:bg-indigo-50/50 transition-all shadow">
            <div className="flex items-center gap-4"><div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-2xl shadow">🔌</div><div><div className="font-black text-gray-900 text-lg">Appliances Se</div><div className="text-sm text-gray-500">Fan, AC, fridge sab add karein</div><div className="mt-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full inline-block">🎯 Zyada Accurate Result</div></div></div>
          </button>
          {/* Voice Agent Option */}
          <div className="relative bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-2xl p-5">
            <div className="absolute -top-3 left-5 bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full">✨ NEW — AI Voice</div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl shadow animate-pulse">🎙️</div>
              <div className="flex-1">
                <div className="font-black text-gray-900 text-lg">Voice Agent Se</div>
                <div className="text-sm text-gray-500">Sirf bol do — AI sab calculate karega</div>
                <div className="mt-2 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full inline-block">🤖 Urdu + English dono</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-indigo-600 bg-white rounded-xl p-2 border border-indigo-100">
              💬 <i>"Mere ghar mein 4 fan, 1 AC, aur 8 ghante load shedding hai"</i> — bas itna bolo!
            </div>
            <div className="mt-2 text-xs text-gray-400 text-center">👆 Screen ke neeche right side mein 🎙️ button dabao</div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── BILL INPUT ────────────────────────────────────────────────────────────
  if (page==="bill") return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily:"'Outfit',sans-serif"}}><style>{FONT}</style><WaBtn/><VoiceAgent city={city} onResult={handleVoiceResult}/>
      <div className="max-w-lg mx-auto px-4 py-10">
        <button onClick={()=>setPage("mode")} className="text-gray-400 text-sm mb-6 flex items-center gap-1 hover:text-gray-600">← Wapas</button>
        <div className="text-center mb-8"><div className="text-5xl mb-3">💡</div><h2 className="text-2xl font-black text-gray-900">Monthly Bijli Bill Likhein</h2><p className="text-gray-500 text-sm mt-1">Average amount — units nahi, sirf rupees</p></div>
        <div className="grid grid-cols-2 gap-2 mb-5">
          {BILL_BRACKETS.map(b=><button key={b.label} onClick={()=>setBill(String(Math.round((b.min+b.max)/2)))} className={`rounded-xl border-2 p-3 text-sm font-bold transition-all text-center ${+bill>=b.min&&+bill<=b.max?"border-emerald-500 bg-emerald-50 text-emerald-700":"border-gray-200 bg-white text-gray-600 hover:border-emerald-300"}`}>{b.label}</button>)}
        </div>
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 mb-5 shadow-sm">
          <label className="text-sm font-bold text-gray-600 block mb-2">Ya exact amount likhein:</label>
          <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-emerald-600 text-lg">PKR</span>
            <input type="number" value={bill} onChange={e=>setBill(e.target.value)} placeholder="15000" className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl text-2xl font-black text-gray-900 focus:outline-none focus:border-emerald-400"/>
          </div>
        </div>
        {bill&&+bill>0&&(()=>{const b=BILL_BRACKETS.find(x=>+bill>=x.min&&+bill<=x.max)||BILL_BRACKETS[6];return(
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-5 text-center">
            <div className="text-sm text-gray-600 mb-1">Recommended system:</div>
            <div className="text-3xl font-black text-emerald-600">{b.sysKw} kW Solar System</div>
            <div className="text-xs text-gray-500 mt-1">Monthly bachat: ~PKR {(+bill*0.85).toLocaleString()}</div>
          </div>
        );})()}
        <button onClick={go} disabled={!bill||+bill<500} className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white py-4 rounded-2xl font-black text-lg shadow-xl transition-all">Apna Solar Solution Dekho ☀️ →</button>
      </div>
    </div>
  );

  // ── APPLIANCES ────────────────────────────────────────────────────────────
  if (page==="appliances") return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily:"'Outfit',sans-serif"}}><style>{FONT}</style><WaBtn/><VoiceAgent city={city} onResult={handleVoiceResult}/>
      <div className="sticky top-0 z-40 bg-white border-b-2 border-gray-100 shadow-sm px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={()=>setPage("mode")} className="text-gray-400 text-sm flex items-center gap-1 hover:text-gray-600">← Wapas</button>
          <div className="font-black text-gray-900">Appliances ({apps.length})</div>
          <button onClick={go} disabled={apps.length===0} className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white px-5 py-2 rounded-xl font-black text-sm shadow">Result Dekho →</button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><AppPicker onAdd={addApp}/></div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="font-black text-gray-900 mb-3 flex justify-between"><span>📋 Aapka Load</span>{apps.length>0&&<span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">{apps.length}</span>}</div>
            {apps.length===0?<div className="text-center py-8 text-gray-400 text-sm"><div className="text-3xl mb-2">📭</div>Koi appliance nahi add kiya</div>:(
              <>
                <div className="space-y-2 max-h-72 overflow-y-auto mb-4 pr-1">
                  {apps.map(a=><div key={a.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 border border-gray-200"><div className="flex items-center gap-2"><span className="text-lg">{a.icon}</span><div><div className="text-xs font-bold text-gray-800">{a.name}</div><div className="text-xs text-gray-400">{a.qty}× · {a.hours}h · {(a.watt*a.qty*a.hours/1000).toFixed(1)}kWh</div></div></div><button onClick={()=>setApps(p=>p.filter(x=>x.id!==a.id))} className="text-gray-300 hover:text-red-400">✕</button></div>)}
                </div>
                {(()=>{const lc=calcFromApps(apps);return(
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 mb-3 grid grid-cols-2 gap-2 text-center">
                    {[["Total Load",`${(lc.watts/1000).toFixed(1)}kW`],["Daily kWh",`${lc.daily.toFixed(1)}`],["Monthly",`${lc.monthly.toFixed(0)} kWh`],["System",`${lc.sys}kW`]].map(([l,v])=>(
                      <div key={l} className="bg-white rounded-lg p-2 border border-emerald-100"><div className="font-black text-emerald-600 text-sm">{v}</div><div className="text-xs text-gray-400">{l}</div></div>
                    ))}
                  </div>
                );})()}
                <button onClick={go} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-black shadow-lg">☀️ Result Dekho →</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ── RESULT ────────────────────────────────────────────────────────────────
  if (page==="result"&&c&&pkgs) {
    const rtabs=[["packages","📦 Packages"],["charts","📊 Charts"],["markets","🏪 Markets"],["savings","💰 Savings"]];
    return (
      <div className="min-h-screen bg-gray-50" style={{fontFamily:"'Outfit',sans-serif"}}><style>{FONT}</style><WaBtn/><VoiceAgent city={city} onResult={handleVoiceResult}/>
        {/* Result Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-700 text-white px-4 py-5">
          <div className="max-w-5xl mx-auto">
            <button onClick={()=>setPage(mode==="bill"?"bill":"appliances")} className="text-white/70 text-sm mb-3 flex items-center gap-1 hover:text-white">← Wapas</button>
            <div className="flex items-start justify-between mb-4">
              <div><h1 className="text-2xl font-black">Aapka Solar Solution Tayyar! ☀️</h1><p className="text-emerald-200 text-sm mt-1">{city} · {CITIES[city].sunHours}h sun/day · 2026 Prices</p></div>
              <button onClick={()=>{const t=total(pkgs.value);const{monthly}=roiCalc(t,c.monthly);const msg=`☀️ *SolarWise Pakistan*\n\nSystem: ${c.sys}kW | City: ${city}\n\nBest Value PKR ${t.toLocaleString()}\nMahinay Bachat: PKR ${monthly.toLocaleString()}\n\nsolarwise.pk 🇵🇰`;window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,"_blank");}} className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-3 py-2 rounded-xl text-xs font-black">📲 Share</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[[`${c.sys} kW`,"Solar System"],[`${c.monthly.toFixed(0)} kWh`,"Monthly Units"],[`PKR ${(c.monthly*RATE).toLocaleString()}`,"Monthly Bachat"],[`${c.backupH.toFixed(1)} Hrs`,"Backup Time"]].map(([v,l])=>(
                <div key={l} className="bg-white/15 rounded-xl p-3 text-center backdrop-blur"><div className="font-black text-white text-lg leading-tight">{v}</div><div className="text-xs text-emerald-200">{l}</div></div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-30 bg-white border-b-2 border-gray-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 flex overflow-x-auto">
            {rtabs.map(([id,lbl])=><button key={id} onClick={()=>setRtab(id)} className={`px-5 py-4 text-sm font-black whitespace-nowrap border-b-2 transition-all ${rtab===id?"border-emerald-500 text-emerald-600":"text-gray-400 hover:text-gray-700 border-transparent"}`}>{lbl}</button>)}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">

          {/* PACKAGES TAB */}
          {rtab==="packages"&&(
            <>
              <div className="text-center mb-6"><div className="text-sm text-gray-500 mb-1">{c.sys}kW system ke liye 3 options</div><h2 className="text-xl font-black text-gray-900">Kaun Sa Package Chahiye?</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                {["budget","value","premium"].map(k=><PkgCard key={k} p={pkgs[k]} c={c} isRec={k==="value"} onWa={waQuote}/>)}
              </div>
              <AIAdvisor c={c} pkgs={pkgs} city={city}/>
              {/* Scam warning */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mt-5">
                <div className="flex items-center gap-2 mb-3"><span className="text-2xl">⚠️</span><div><div className="font-black text-red-700">Dhoka Khane Se Bachein!</div><div className="text-xs text-red-500">Pakistan mein B-grade panels ki bhari market hai</div></div></div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-red-700">
                  {["🚫 B-grade/duplicate panels — hologram check karein","🚫 Warranty card original na ho to mat lein","🚫 Sirf cash deal karne wale se dur rahein","🚫 AEDB-certified installer zaroori hai","🚫 Serial number manufacturer site pe verify karein","🚫 Bahut sasta = B-grade — alert rahein"].map((t,i)=><div key={i}>{t}</div>)}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-5">
                <button onClick={()=>{const p=pkgs.value;const t=total(p);const{monthly,years,net25}=roiCalc(t,c.monthly);const txt=`SOLARWISE PAKISTAN\nDate: ${new Date().toLocaleDateString("en-PK")}\nCity: ${city}\n\nSystem: ${c.sys}kW | Monthly: ${c.monthly.toFixed(0)} kWh\n\nBEST VALUE PACKAGE - PKR ${t.toLocaleString()}\nPanels: ${p.panels.qty}x ${p.panels.brand} ${p.panels.model}\nInverter: ${p.inverter.kw}kW ${p.inverter.brand}\nBattery: ${p.battery.qty}x ${p.battery.brand}\n\nMonthly Savings: PKR ${monthly.toLocaleString()}\nPayback: ${years.toFixed(1)} saal\n25yr Return: PKR ${(net25/1e6).toFixed(1)}M\n\nMarkets in ${city}:\n${(CITIES[city]?.markets||[]).join("\n")}\n\nsolarwise.pk`;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([txt],{type:"text/plain"}));a.download="SolarWise-Quote.txt";a.click();}} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm shadow">📥 Quote Download</button>
                <button onClick={()=>window.print()} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-black text-sm shadow">🖨️ Print</button>
              </div>
            </>
          )}

          {/* CHARTS TAB */}
          {rtab==="charts"&&(
            <div className="space-y-5">
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-1">☀️ Solar Production vs Consumption (kWh)</h3>
                <p className="text-xs text-gray-400 mb-4">Hara = Solar paidawar · Banafshai = Aapka kharch</p>
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={monthlyChart}>
                    <defs>
                      <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                      <linearGradient id="gk" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="m" tick={{fill:"#9ca3af",fontSize:11}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{borderRadius:"12px",border:"1px solid #e5e7eb",fontSize:"12px"}}/>
                    <Area type="monotone" dataKey="Solar" stroke="#10b981" fill="url(#gs)" strokeWidth={2.5}/>
                    <Area type="monotone" dataKey="Kharch" stroke="#6366f1" fill="url(#gk)" strokeWidth={2.5}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {pieData.length>0&&(
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-4">🔍 Konsa Appliance Kitni Bijli Khata Hai</h3>
                  <ResponsiveContainer width="100%" height={200}><PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value" nameKey="name">{pieData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie><Tooltip formatter={v=>[`${v} kWh/day`,""]} contentStyle={{borderRadius:"12px",fontSize:"12px"}}/></PieChart></ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">{pieData.map((d,i)=><span key={d.name} className="flex items-center gap-1 text-xs text-gray-600"><span className="w-3 h-3 rounded-full" style={{background:PIE_COLORS[i%PIE_COLORS.length]}}/>{d.name}: {d.value}kWh</span>)}</div>
                </div>
              )}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-4">📐 Chhat Ki Zaroorat</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[["Panels",`${Math.ceil(c.sys*1000/550)}`],["Har Panel","2.2×1.1 m"],["Total Area",`${(Math.ceil(c.sys*1000/550)*2.4).toFixed(0)} m²`],["Net Metering",c.sys<=100?"✅ Eligible":"NEPRA check"]].map(([l,v])=>(
                    <div key={l} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200"><div className="font-black text-gray-900 text-sm">{v}</div><div className="text-xs text-gray-400 mt-0.5">{l}</div></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* MARKETS TAB */}
          {rtab==="markets"&&(
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                {Object.entries(CITIES).map(([ct,d])=>(
                  <div key={ct} className={`bg-white border-2 rounded-2xl p-4 shadow-sm ${ct===city?"border-emerald-400 bg-emerald-50":"border-gray-200"}`}>
                    <div className="flex items-center gap-2 mb-3"><span className="text-xl">🏙️</span><div><div className="font-black text-gray-900">{ct}</div><div className="text-xs text-emerald-600 font-bold">{d.sunHours}h ☀️ · {d.urdu}</div></div></div>
                    {d.markets.map(m=><div key={m} className="text-xs text-gray-600 flex gap-1.5 mb-1"><span className="text-emerald-500">📍</span>{m}</div>)}
                  </div>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-4">✅ Khareedtay Waqt Yeh Karein</h3>
                  {["Warranty card pe original hologram check karein","Panels serial number manufacturer site pe verify karein","AEDB-certified installer se hi kaam karwayein","Kam se kam 3 vendors se quote lein","Bank transfer karein — cash deal mat karein","Net metering application installer se karwayein"].map((t,i)=>(
                    <div key={i} className="flex gap-2 text-sm text-gray-600 mb-2"><span className="text-emerald-500 font-bold">✓</span>{t}</div>
                  ))}
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-4">🏷️ Panel Brands — 2026 Prices</h3>
                  {[["Longi Solar","28/W","Tier-1 ⭐⭐⭐"],["Jinko Solar","27/W","Tier-1 ⭐⭐⭐"],["JA Solar","26/W","Tier-1 ⭐⭐⭐"],["Canadian Solar","27/W","Tier-1 ⭐⭐⭐"]].map(([n,p,t])=>(
                    <div key={n} className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2 last:border-0"><div className="font-bold text-gray-800 text-sm">{n}</div><div className="text-right"><div className="text-xs font-black text-emerald-600">PKR {p}</div><div className="text-xs text-gray-400">{t}</div></div></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SAVINGS TAB */}
          {rtab==="savings"&&(
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {["budget","value","premium"].map(k=>{const t=total(pkgs[k]);const{monthly,years,net25}=roiCalc(t,c.monthly);return(
                  <div key={k} className={`bg-white border-2 rounded-2xl p-5 shadow-sm ${k==="value"?"border-emerald-400":""}`}>
                    <div className="flex items-center gap-2 mb-3"><div className="w-3 h-3 rounded-full" style={{background:pkgs[k].color}}/><span className="font-black text-gray-900">{pkgs[k].label}</span></div>
                    {[["💰 Mahinay Bachat",`PKR ${monthly.toLocaleString()}`,"text-emerald-600"],["📅 Saalanah",`PKR ${(monthly*12).toLocaleString()}`,"text-emerald-600"],["⏱️ Payback",`${years.toFixed(1)} saal`,"text-amber-600"],["🏆 25 Saal",`PKR ${(net25/1e6).toFixed(1)}M`,"text-indigo-600"]].map(([l,v,cl])=>(
                      <div key={l} className="flex justify-between text-sm border-b border-gray-100 pb-2 mb-2 last:border-0"><span className="text-gray-500">{l}</span><span className={`font-black ${cl}`}>{v}</span></div>
                    ))}
                  </div>
                );})}
              </div>

              <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 shadow-sm">
                <h3 className="font-black text-gray-900 mb-1">📈 25 Saal Mein Net Faida (Best Value)</h3>
                <p className="text-xs text-gray-400 mb-4">Jab line upar jaye — paisa wapis aa gaya!</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={Array.from({length:26},(_,i)=>{const t=total(pkgs.value);const{monthly}=roiCalc(t,c.monthly);return{y:`Y${i}`,Faida:Math.max(0,+(monthly*12*i-t).toFixed(0))};})}>
                    <defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/><XAxis dataKey="y" tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false} interval={4}/><YAxis tick={{fill:"#9ca3af",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
                    <Tooltip contentStyle={{borderRadius:"12px",fontSize:"12px"}} formatter={v=>[`PKR ${v.toLocaleString()}`,"Net Faida"]}/>
                    <Area type="monotone" dataKey="Faida" stroke="#10b981" fill="url(#gf)" strokeWidth={2.5}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {(()=>{const{net25}=roiCalc(total(pkgs.value),c.monthly);return(
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                  <h3 className="font-black text-gray-900 mb-4">🚗 25 Saal Ki Bachat Se Kya Khareed Sakte Hain?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    {[["🚗","Gariyan",Math.floor(net25/3000000),"Honda Civic"],["🏠","Plot Deposit",Math.floor(net25/1000000),"Lakh PKR"],["✈️","Hajj Safar",Math.floor(net25/500000),"Trips"],["📱","Phones",Math.floor(net25/150000),"Flagship"]].map(([ic,t,cnt,u])=>(
                      <div key={t} className="bg-white rounded-xl p-3 border border-amber-200"><div className="text-2xl mb-1">{ic}</div><div className="font-black text-gray-900 text-xl">{cnt>0?cnt:"<1"}</div><div className="text-xs font-bold text-gray-600">{t}</div><div className="text-xs text-gray-400">{u}</div></div>
                    ))}
                  </div>
                </div>
              );})()}

              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5">
                <h3 className="font-black text-gray-900 mb-3">⚡ NEPRA Net Metering</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div><div className="font-bold text-gray-800 mb-2">Kaise Kaam Karta Hai:</div>{["Zyada solar grid mein jata hai","DISCO credit deta hai","Mahinay bill mein se minus hota hai","1MW tak eligible"].map((t,i)=><div key={i} className="flex gap-2 mb-1"><span className="text-indigo-500">→</span>{t}</div>)}</div>
                  <div><div className="font-bold text-gray-800 mb-2">Apply Karne Ka Tarika:</div>{["Local DISCO (LESCO/KESC) se form lein","Net metering meter lagwana hoga","AEDB installer zaroori hai","30-90 din process hota hai"].map((t,i)=><div key={i} className="flex gap-2 mb-1"><span className="text-indigo-500">→</span>{t}</div>)}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="bg-emerald-600 text-white mt-8 py-8 px-4 text-center">
          <h3 className="text-xl font-black mb-2">Abhi Order Karein — 7-10 Din Mein Installation!</h3>
          <p className="text-emerald-200 text-sm mb-4">Certified installers {city} mein available hain</p>
          <button onClick={()=>{const t=total(pkgs.value);const msg=`Assalam o Alaikum! ${c.sys}kW solar ${city} mein chahiye.\nBest Value (PKR ${t.toLocaleString()}) interested hoon.\nPlease contact karein.`;window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`,"_blank");}} className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-8 py-4 rounded-2xl font-black text-lg shadow-xl transition-all hover:scale-105">
            📱 WhatsApp pe Free Quote Lo →
          </button>
        </div>
      </div>
    );
  }
  return null;
}
