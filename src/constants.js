export const PLAYERS = [
  "Isaac Trouchet","Sergio Becerra","Comfort Nyashanu","Jamie Conti","Aaron Pepper",
  "Michael Caniglia","Darryn Tran","Noah Brandis","Dylan Williams","Ayrton Donegan",
  "Jordan Gumina-Wright","Ned Baker","Luca Monastra","Matt Lit","Jacob Kniebe",
  "Cort Burridge","Melvin Einarsson","Jake Mazzuchelli","Adam Wilkinson","Michael Allen",
  "Deklan Harvey","Tom Hughes","Matthew Wright","Tom Howorth","Aaron Priemus",
]

export const MATCH_WEEKS = Array.from({ length: 22 }, (_, i) => `Week ${i + 1}`)

export const DEFAULT_FINE_MENU = [
  { id:"f1",  label:"Late to Training",      amount:5,  emoji:"⏰" },
  { id:"f2",  label:"Late to Match",         amount:10, emoji:"🕐" },
  { id:"f3",  label:"Missing Training",      amount:10, emoji:"🏃" },
  { id:"f4",  label:"Missing Match",         amount:20, emoji:"❌" },
  { id:"f5",  label:"Wrong Kit",             amount:5,  emoji:"👕" },
  { id:"f6",  label:"Phone on Pitch",        amount:5,  emoji:"📱" },
  { id:"f7",  label:"Bad Attitude",          amount:15, emoji:"😤" },
  { id:"f8",  label:"Missed Team Event",     amount:10, emoji:"🎉" },
  { id:"f9",  label:"Not Paying Fines",      amount:10, emoji:"💸" },
  { id:"f10", label:"Talking Back to Coach", amount:10, emoji:"🗣️" },
  { id:"f11", label:"Early Exit Training",   amount:5,  emoji:"🚪" },
  { id:"f12", label:"Custom Fine",           amount:0,  emoji:"✏️", custom:true },
]

export const PAYMENT_INFO = {
  accountName: "Southern Spirit FC",
  bsb: "XXX-XXX",
  account: "XXXX XXXX",
  reference: "Your name + Fines (e.g. John Smith Fines)",
}
