export const config = {
  name: 'Mila',
  age: 21,
  birthDay: 9,
  birthMonth: 10,
  birthYear: 2005,

  photo: '/images/galeri/mila1.jpeg',
  musicUrl: '/music/shape-of-my-heart.mp3',

  greeting: 'Hari ini dunia berbahagia, karena seseorang yang istimewa sedang bertambah usia.',
  subGreeting: 'Semoga tahun ini penuh cinta, tawa, dan mimpi yang jadi nyata.',

  // Foto-foto dia + kata-kata/ucapan yang muncul saat foto dibuka (lightbox).
  // Ganti dengan foto asli: taruh di public/images/galeri/
  // lalu sesuaikan path di bawah (mis. /images/galeri/foto1.jpg).
  gallery: [
    {
      src: '/images/galeri/milagallery.jpeg',
      caption: 'Senyum manis yang selalu bikin cerah',
      message: 'Semoga selalu cantik, sehat, dan jadi pribadi yang paling ceria.',
    },
    {
      src: '/images/galeri/milagallery1.jpeg',
      caption: 'Momen bahagia kita',
      message: 'Semoga pintu rezeki dan kebahagiaan terbuka lebar untukmu.',
    },
    {
      src: '/images/galeri/milagallery2.jpeg',
      caption: 'Tawa yang tak terlupakan',
      message: 'Semua impian dan cita-citamu semoga satu per satu terwujud.',
    },
    {
      src: '/images/galeri/milagallery3.jpeg',
      caption: 'Cantik, ceria, apa adanya',
      message: 'Semoga selalu dikelilingi orang-orang yang tulus menyayangimu.',
    },
    {
      src: '/images/galeri/milagallery4.jpeg',
      caption: 'Setiap momen jadi istimewa',
      message: 'Terima kasih sudah jadi dirimu yang luar biasa, Mila.',
    },
    {
      src: '/images/galeri/milagallery5.jpeg',
      caption: 'Terus bersinar ya',
      message: 'Kamu pantas mendapatkan semua hal indah di dunia. 💐',
    },
  ],

  slides: [
    { src: '/images/galeri/moment.jpeg', title: 'Momen Manis', subtitle: 'Senyum yang selalu bikin hari jadi lebih cerah.' },
    { src: '/images/galeri/manis.jpeg', title: 'Bahagia Selalu', subtitle: 'Semoga tahun ini penuh tawa dan kenangan indah.' },
    { src: '/images/galeri/bersinar.jpeg', title: 'Terus Bersinar', subtitle: 'Seindah dirimu yang penuh warna dan cinta.' },
  ],

  secretTitle: 'Kejutan Spesial',
  secretMessage:
    'Selamat ulang tahun, Mila! Terima kasih sudah jadi dirimu yang luar biasa. Kamu pantas mendapatkan semua hal indah di dunia. 💐',
}

export default config
