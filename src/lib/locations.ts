export type Location = {
  id: string
  name: string
  address: string
  metro?: string
  note?: string
  franchise?: boolean
  image: string
  hours?: string
  phone?: string
  format: "Ресторан" | "Стритфуд"
}

export const locations: Location[] = [
  {
    id: "bashnya-naberezhnaya",
    name: "Башня на Набережной",
    address: "г. Москва, Пресненская набережная, д. 10",
    metro: "Деловой центр (Москва-Сити)",
    image: "/locations/1.jpg",
    phone: "+7 (905) 977-57-00",
    hours: "Пн–Сб: 10:00–22:00 • Вс: Выходной",
    format: "Ресторан",
  },
  {
    id: "presnenskaya",
    name: "Мясная тема",
    address: "г. Москва, Пресненская набережная, д. 10",
    metro: "Деловой центр (Москва-Сити)",
    image: "/locations/14.jpg",
    phone: "+7 (905) 977-57-00",
    hours: "Пн–Сб: 10:00–22:00 • Вс: 12:00–18:00",
    format: "Ресторан",
  },
  {
    id: "botanica",
    name: "ТЦ BOTANICA",
    address: "г. Москва, ул. Вильгельма Пика, д. 11",
    metro: "Ботанический сад",
    image: "/locations/2.jpg",
    phone: "+7 (905) 977-57-00",
    hours: "Ежедневно: 10:00–22:00",
    format: "Ресторан",
  },
  {
    id: "arkadia",
    name: "ТЦ Аркадия",
    address: "г. Москва, Б. Овчинниковский пер., д. 16",
    metro: "Новокузнецкая",
    franchise: true,
    image: "/locations/12.jpeg",
    phone: "+7 (903) 538-31-91",
    hours: "Ежедневно: 10:00–22:00",
    format: "Ресторан",
  },
  {
    id: "central-market",
    name: "Фуд-холл Центральный рынок",
    address: "г. Москва, Рождественский бульвар, д. 1",
    metro: "Трубная",
    image: "/locations/15.png",
    format: "Ресторан",
  },
  {
    id: "okhotny-ryad",
    name: "ТЦ Охотный ряд",
    address: "г. Москва, Манежная площадь, д. 1с2",
    metro: "Охотный ряд",
    image: "/locations/13%20.jpg",
    format: "Ресторан",
  },
  {
    id: "nautilus",
    name: "ШАУРМА",
    address: "г. Москва, ул. Никольская, д. 25",
    metro: "Лубянка",
    note: "ТЦ НАУТИЛУС",
    image: "/locations/6.jpg",
    phone: "+7 (905) 977-57-00",
    hours: "Круглосуточно",
    format: "Стритфуд",
  },
  {
    id: "dmitrovka",
    name: "ШАУРМА И ЧУРРОС",
    address: "г. Москва, ул. Большая Дмитровка, д. 7/5, стр. 1",
    metro: "Охотный ряд",
    image: "/locations/10.png",
    phone: "+7 (905) 977-57-00",
    hours: "Круглосуточно",
    format: "Стритфуд",
  },
]

export function getLocationMapUrl(location: Pick<Location, "address">) {
  const query = encodeURIComponent(location.address)

  return `https://yandex.ru/maps/?text=${query}&z=16`
}
