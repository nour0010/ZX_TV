/* الكتالوج المحلي (بيانات تجريبية)
 *
 * الحقول:
 *  id        معرّف قصير بالإنجليزي (يطلع بالرابط movie.html?id=...)
 *  title     الاسم المعروض     original  الاسم الأصلي
 *  year      سنة الإصدار       rating    التقييم من 10 (تقريبي)
 *  runtime   المدة بالدقائق    genres    مفاتيح من data/genres.js
 *  director  المخرج            overview  الملخص
 *  poster    رابط صورة (اختياري) — إذا فارغ يصير بوستر تلقائي بالاسم
 *  backdrop  رابط خلفية عريضة (اختياري)
 *  trailer   معرّف فيديو يوتيوب (اختياري)
 *  video     رابط ملف mp4/webm تملك حق عرضه (اختياري) — يطلع مشغّل بصفحة الفلم
 */
window.ZX_MOVIES = [
  {
    id: "jujutsu-kaisen-0", title: "جوجوتسو كايسن 0", original: "Jujutsu Kaisen 0",
    year: 2021, rating: 7.7, runtime: 105, genres: ["animation", "action", "fantasy"],
    director: "Sunghoo Park",
    overview: "يوتا أوكوتسو مراهق تلاحقه لعنة قوية ربطته بها صديقة طفولته ريكا. ينضم إلى مدرسة الجوجوتسو ليتعلم السيطرة على قوته، ويواجه ساحراً يخطط للقضاء على البشر العاديين.",
    poster: "assets/jj.jpg", trailer: "901o9QSXqAA",
  },
  {
    id: "inception", title: "البداية", original: "Inception",
    year: 2010, rating: 8.8, runtime: 148, genres: ["scifi", "action", "thriller"],
    director: "Christopher Nolan",
    overview: "لص محترف يسرق الأسرار من داخل أحلام الناس، ويُعرض عليه عمل شبه مستحيل: زرع فكرة داخل عقل شخص بدل سرقتها.",
  },
  {
    id: "the-dark-knight", title: "فارس الظلام", original: "The Dark Knight",
    year: 2008, rating: 9.0, runtime: 152, genres: ["action", "crime", "drama"],
    director: "Christopher Nolan",
    overview: "باتمان يواجه الجوكر، مجرماً فوضوياً يدفع مدينة غوثام إلى حافة الانهيار ويختبر حدود البطل والقانون.",
  },
  {
    id: "interstellar", title: "بين النجوم", original: "Interstellar",
    year: 2014, rating: 8.7, runtime: 169, genres: ["scifi", "drama", "adventure"],
    director: "Christopher Nolan",
    overview: "والأرض تواجه خطر المجاعة، يقود طيار سابق فريقاً عبر ثقب دودي بحثاً عن كوكب جديد تعيش عليه البشرية.",
  },
  {
    id: "oppenheimer", title: "أوبنهايمر", original: "Oppenheimer",
    year: 2023, rating: 8.3, runtime: 180, genres: ["drama", "history", "thriller"],
    director: "Christopher Nolan",
    overview: "قصة روبرت أوبنهايمر والعلماء الذين صنعوا القنبلة الذرية ضمن مشروع مانهاتن، وما تبعه من صراع أخلاقي وسياسي.",
  },
  {
    id: "parasite", title: "طفيلي", original: "Parasite",
    year: 2019, rating: 8.5, runtime: 132, genres: ["thriller", "drama", "comedy"],
    director: "Bong Joon-ho",
    overview: "عائلة فقيرة تتسلل تدريجياً إلى حياة عائلة ثرية، وتنقلب الأمور بطريقة لا يتوقعها أحد.",
  },
  {
    id: "spirited-away", title: "المخطوفة", original: "Spirited Away",
    year: 2001, rating: 8.6, runtime: 125, genres: ["animation", "fantasy", "family"],
    director: "Hayao Miyazaki",
    overview: "فتاة صغيرة تعلق في عالم الأرواح، وتضطر للعمل في حمّام غريب حتى تنقذ والديها وتعود إلى عالمها.",
  },
  {
    id: "your-name", title: "اسمك", original: "Kimi no Na wa",
    year: 2016, rating: 8.4, runtime: 106, genres: ["animation", "romance", "drama"],
    director: "Makoto Shinkai",
    overview: "مراهقان لا يعرفان بعضهما يتبادلان أجسادهما بشكل غامض، وتنشأ بينهما رابطة تتجاوز المسافة والزمن.",
  },
  {
    id: "demon-slayer-mugen-train", title: "قاتل الشياطين: قطار المالانهاية", original: "Demon Slayer: Mugen Train",
    year: 2020, rating: 8.2, runtime: 117, genres: ["animation", "action", "fantasy"],
    director: "Haruo Sotozaki",
    overview: "تانجيرو ورفاقه يصعدون قطاراً غامضاً للتحقيق في اختفاء عشرات الركاب، ويواجهون شيطاناً شديد القوة.",
  },
  {
    id: "mad-max-fury-road", title: "ماد ماكس: طريق الغضب", original: "Mad Max: Fury Road",
    year: 2015, rating: 8.1, runtime: 120, genres: ["action", "adventure", "scifi"],
    director: "George Miller",
    overview: "في صحراء ما بعد الانهيار، تهرب فيوريوسا مع زوجات الطاغية إيموتان، ويلحق بهم ماكس في مطاردة لا تهدأ.",
  },
  {
    id: "the-shawshank-redemption", title: "الخلاص من شاوشانك", original: "The Shawshank Redemption",
    year: 1994, rating: 9.3, runtime: 142, genres: ["drama"],
    director: "Frank Darabont",
    overview: "مصرفي متهم ظلماً بالقتل يقضي عقوبته في سجن شاوشانك، ويبني صداقة وأملاً يصمدان عبر السنين.",
  },
  {
    id: "gladiator", title: "المصارع", original: "Gladiator",
    year: 2000, rating: 8.5, runtime: 155, genres: ["action", "drama", "history"],
    director: "Ridley Scott",
    overview: "قائد روماني يتحول إلى مصارع بعد خيانة سلبته عائلته ومكانته، ويسعى للانتقام من الإمبراطور.",
  },
  {
    id: "spider-man-into-the-spider-verse", title: "سبايدرمان: عبر الكون العنكبوتي", original: "Spider-Man: Into the Spider-Verse",
    year: 2018, rating: 8.4, runtime: 117, genres: ["animation", "action", "adventure"],
    director: "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    overview: "مايلز موراليس يصير سبايدرمان، ويلتقي بنسخ أخرى من الشخصية جاءت من أكوان موازية.",
  },
  {
    id: "dune", title: "كثيب", original: "Dune",
    year: 2021, rating: 8.0, runtime: 155, genres: ["scifi", "adventure", "drama"],
    director: "Denis Villeneuve",
    overview: "بول أتريديس يرافق عائلته إلى كوكب أراكيس الصحراوي، حيث تتصارع القوى الكبرى على أثمن مورد في الكون.",
  },
  {
    id: "whiplash", title: "ويبلاش", original: "Whiplash",
    year: 2014, rating: 8.5, runtime: 106, genres: ["drama", "music"],
    director: "Damien Chazelle",
    overview: "عازف طبول شاب يسعى للعظمة تحت إشراف معلّم موسيقى قاسٍ لا يعرف الرحمة.",
  },
  {
    id: "the-conjuring", title: "الشعوذة", original: "The Conjuring",
    year: 2013, rating: 7.5, runtime: 112, genres: ["horror", "mystery", "thriller"],
    director: "James Wan",
    overview: "محققان في الظواهر الخارقة يساعدان عائلة تتعرض لقوة شريرة داخل منزلها الريفي.",
  },
  {
    id: "get-out", title: "اخرج", original: "Get Out",
    year: 2017, rating: 7.7, runtime: 104, genres: ["horror", "mystery", "thriller"],
    director: "Jordan Peele",
    overview: "شاب يزور عائلة صديقته لأول مرة، ويكتشف أن وراء الترحيب الزائد سراً مخيفاً.",
  },
  {
    id: "coco", title: "كوكو", original: "Coco",
    year: 2017, rating: 8.4, runtime: 105, genres: ["animation", "family", "fantasy"],
    director: "Lee Unkrich",
    overview: "ميغيل يحلم بالموسيقى رغم منع عائلته لها، فيجد نفسه في أرض الأموات يبحث عن سر أجداده.",
  },
  {
    id: "the-grand-budapest-hotel", title: "فندق بودابست الكبير", original: "The Grand Budapest Hotel",
    year: 2014, rating: 8.1, runtime: 99, genres: ["comedy", "drama", "adventure"],
    director: "Wes Anderson",
    overview: "مغامرات حارس فندق أسطوري وصبي الردهة الشاب في أوروبا بين الحربين، وسرقة لوحة ثمينة.",
  },
  {
    id: "everything-everywhere-all-at-once", title: "كل شيء في كل مكان دفعة واحدة", original: "Everything Everywhere All at Once",
    year: 2022, rating: 7.8, runtime: 139, genres: ["scifi", "comedy", "action"],
    director: "Daniel Kwan, Daniel Scheinert",
    overview: "صاحبة مغسلة تكتشف أنها الوحيدة القادرة على إنقاذ الأكوان المتعددة وسط فوضى الضرائب والعائلة.",
  },
  {
    id: "joker", title: "جوكر", original: "Joker",
    year: 2019, rating: 8.4, runtime: 122, genres: ["crime", "drama", "thriller"],
    director: "Todd Phillips",
    overview: "رجل يعاني الوحدة والمرض النفسي في غوثام ينزلق تدريجياً نحو العنف ويتحول إلى الجوكر.",
  },
  {
    id: "toy-story", title: "قصة لعبة", original: "Toy Story",
    year: 1995, rating: 8.3, runtime: 81, genres: ["animation", "comedy", "family"],
    director: "John Lasseter",
    overview: "الراعي وودي يشعر بالتهديد عندما يصل باز لايتير، وتضطر الألعاب للتعاون من أجل العودة إلى صاحبها.",
  },
];
