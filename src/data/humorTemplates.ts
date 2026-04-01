export interface HumorTemplate {
  id: number;
  title: string;
  category: string;
  text: string;
}

export const humorTemplates: HumorTemplate[] = [
  {
    id: 1,
    title: "Desi Parents vs Career",
    category: "Family",
    text: `Papa: Beta, tumhara result aa gaya?
Me: Haan Papa, 75% aaye.
Papa: Sharma ji ke bete ke 95% aaye. Woh IIT jayega.
Me: Par Papa, mujhe comedy karna hai, standup...
Papa: Standup? Beta khade hoke padhai karo, standup apne aap ho jayega.
Mummy: Kuch bhi karo beta, pehle IAS ki taiyari kar lo. Baad mein joke maarna.
Me: Mummy, IAS interview mein joke marunga toh select ho jaunga?
Papa: Sharma ji ka beta joke nahi maarta. Woh serious hai. Isliye uski life mein comedy nahi hai... matlab problems nahi hai.`
  },
  {
    id: 2,
    title: "Auto-rickshaw Bargaining",
    category: "Street",
    text: `Me: Bhaiya, Connaught Place chaloge?
Auto wala: 300 rupaye.
Me: Kya bhaiya! Meter se 80 aata hai!
Auto wala: Meter kharab hai sahab.
Me: Aapka meter 2019 se kharab hai, maine pichli baar bhi aapko dekha tha.
Auto wala: Traffic bahut hai sahab.
Me: Bhaiya abhi raat ke 11 baj rahe hain, sadak pe sirf kutte hain.
Auto wala: Kutte bhi toh avoid karne padte hain na. Skill chahiye.
Me: Theek hai 150 de dunga.
Auto wala: 250 se kam nahi.
Me: Bhaiya Uber pe 90 dikha raha hai.
Auto wala: Toh Uber le lo na, woh aayega 20 minute mein. Tab tak 50 ka chai pi lo.`
  },
  {
    id: 3,
    title: "IPL Watch Party Fight",
    category: "Cricket",
    text: `Rahul: CSK is the best team ever! Dhoni forever!
Amit: Bhai Dhoni retire ho chuke hain practically.
Rahul: Dhoni kabhi retire nahi hota. Woh immortal hai.
Priya: Guys, RCB ka match hai, dhyan do.
Amit: RCB ka dhyan dena matlab dukh ko invite karna.
Priya: Iss baar cup aa raha hai!
Rahul: Yeh dialogue har saal sunta hoon.
Amit: RCB fans ke paas cup nahi hai, par hope ka overdose zaroor hai.
Priya: At least hamare paas Kohli hai!
Rahul: Kohli ke paas bhi RCB ka cup nahi hai.
Priya: *throws cushion*`
  },
  {
    id: 4,
    title: "Office Zoom Call Disaster",
    category: "Office",
    text: `Boss: So let's start the standup meeting. Rajesh, your update?
Rajesh: Sir, mera mic nahi chal raha...
Boss: Rajesh, hum tumhe sun sakte hain.
Rajesh: *still typing in chat* "my mic is not working"
Boss: RAJESH. WE CAN HEAR YOU.
Rajesh: Oh sorry sir, actually main keh raha tha ki task complete hai.
Pooja: Sir meri camera on nahi ho rahi, please excuse.
Boss: Pooja, tumhara background mein beach dikh raha hai.
Pooja: Sir woh virtual background hai...
Boss: Virtual background mein tumhare pair sand pe hain?
Pooja: ...
Boss: Meeting ke baad mujhse baat karo.`
  },
  {
    id: 5,
    title: "College Group Project",
    category: "College",
    text: `WhatsApp Group - "Project Warriors 💪"
Ankit: Guys, submission kal hai. Kisne kya kiya?
*silence for 4 hours*
Riya: Main toh intro likh dungi.
Ankit: Intro 2 line ka hai Riya.
Riya: Quality matters, not quantity 💅
Sahil: Bhai mera laptop kharab ho gaya.
Ankit: Sahil tu toh abhi Instagram pe story daal raha tha laptop se.
Sahil: Woh phone se daali thi bhai.
Ankit: Story mein laptop dikha raha hai screen pe 🙄
Deepak: Guys chill, main raat ko kar lunga sab.
Ankit: Deepak tu har baar yehi bolta hai aur subah 4 baje "bhai ho gaya?" message aata hai.
Deepak: Trust the process bro.`
  },
  {
    id: 6,
    title: "Shaadi Mein Rishtedaar",
    category: "Shaadi",
    text: `Aunty: Beta, kitne saal ke ho gaye?
Me: 26 aunty.
Aunty: 26! Humari Pinky ki toh 23 mein shaadi ho gayi thi.
Me: Pinky ka divorce bhi 25 mein ho gaya tha aunty.
Aunty: *shocked pikachu face*
Uncle: Beta, kya karte ho?
Me: Software engineer hoon uncle.
Uncle: Kitna package hai?
Me: Uncle, arranged marriage interview nahi hai yeh.
Uncle: Beta, agar package accha hai toh interview dena padta. Ladki wale dekhte hain.
Aunty: Humari building mein ek ladki hai, doctor hai. Baat karein?
Me: Aunty, main abhi biryani khaane aaya hoon. Rishta nahi.`
  },
  {
    id: 7,
    title: "Flatmate Food Theft",
    category: "Flatmates",
    text: `Me: Bhai, mera Amul butter kisne khaya?
Rohan: Maine nahi khaya.
Me: Rohan, tere haath pe butter laga hai literally.
Rohan: Woh mera apna butter hai.
Me: Tere paas butter kabhi tha hi nahi. Tu toh bread bhi mera khaata hai.
Rohan: Sharing is caring bro.
Me: Caring tab hoti jab tu kabhi kuch laata. Tera fridge mein sirf ek sadha hua nimbu hai.
Rohan: Woh nimbu bahut important hai, nazar utaarne ke liye hai.
Me: Nazar toh mujhe utaarni chahiye, tujh jaisa flatmate mila hai.
Rohan: Chal chal, zyada mat bol. Kal maggi banaunga tere liye.
Me: Meri maggi se? 
Rohan: ...haan.`
  },
  {
    id: 8,
    title: "Indian Train Journey",
    category: "Travel",
    text: `Uncle on upper berth: Beta, hum exchange kar lein? Humse upar nahi chadha jaata.
Me: Uncle, aapne upper berth book kiya kyun phir?
Uncle: Beta, tatkal mein choice nahi milti.
Me: Mujhe bhi tatkal mein mili thi uncle, main bhi nahi dena chahta.
Aunty: Beta, uncle ki kamar mein problem hai.
Me: Aunty, meri bhi kamar mein problem hogi agar main iss lower berth pe teen logon ke saath sounga.
*Meanwhile chai wala enters*
Chai wala: CHAI CHAI CHAI CHAI!
Uncle: Ek chai dena.
Chai wala: 15 rupaye.
Uncle: 15?! Ghar pe 2 rupaye ki banti hai!
Chai wala: Toh ghar pe piyo uncle.
Uncle: *orders two anyway*`
  },
  {
    id: 9,
    title: "Sharma Ji Ka Beta",
    category: "Family",
    text: `Papa: Sharma ji ka beta Google mein lag gaya.
Me: Accha? Good for him.
Papa: 50 lakh package hai.
Me: Papa, mere bhi acche marks aaye hain...
Papa: Sharma ji ka beta class mein first aaya. 
Me: Papa woh alag subject hai!
Papa: Sharma ji ka beta subah 5 baje uthta hai.
Me: Papa woh insomnia patient hai, choice se nahi uthta.
Papa: Sharma ji ka beta gym bhi jaata hai.
Me: Papa Sharma ji ke bete ki girlfriend bhi hai, woh bhi batao.
Papa: Haan woh bhi hai. Ladki IAS officer hai.
Me: *leaves chat, leaves house, leaves country*`
  },
  {
    id: 10,
    title: "Festival Planning Chaos",
    category: "Festival",
    text: `Family Group - "Diwali 2024 🪔✨"
Mummy: Iss saal Diwali pe sab ghar aao.
Chacha: Hum aa rahe hain, 8 log.
Mummy: 8?! Pichli baar 4 the!
Chacha: Bhabhi, bacche bade ho gaye, unke dost bhi aa rahe hain.
Bua: Hum bhi aa rahe hain. 6 log plus driver.
Papa: Driver kahan soyega?
Bua: Aapke drawing room mein?
Papa: Drawing room mein toh pehle se Chacha ke 8 log hain.
Mummy: Koi baat nahi, terrace pe tent laga denge.
Me: Mummy yeh Diwali hai ya Kumbh Mela?
Mummy: Chup kar aur 10 kilo mithai order kar.`
  },
  {
    id: 11,
    title: "Gym Bro Conversation",
    category: "Fitness",
    text: `Gym bro: Bhai, aaj leg day hai.
Me: Bhai main toh chest karne aaya tha.
Gym bro: Chest? Bhai Monday ko chest hota hai. Aaj Wednesday hai, legs.
Me: Bhai main apna schedule follow karta hoon.
Gym bro: Bhai protein shake liya?
Me: Nahi bhai, chai pi ke aaya hoon.
Gym bro: CHAI?! Bhai chai se muscles nahi bante!
Me: Bhai tere muscles bhi nahi ban rahe, tu 6 mahine se same weight utha raha hai.
Gym bro: Bhai main lean bulk kar raha hoon.
Me: Lean bulk matlab kuch nahi ho raha par fancy naam de diya?
Gym bro: Bhai tu nahi samjhega, tera protein intake low hai.
Me: Mera patience intake bhi low hai.`
  },
  {
    id: 12,
    title: "Cab Driver Philosophy",
    category: "Street",
    text: `Uber driver: Sahab, IT mein ho?
Me: Haan bhai.
Driver: Kitna kamate ho?
Me: Bhai, woh...
Driver: Arre batao na, main judge nahi karunga.
Me: 15 lakh.
Driver: Bas? Bhai main toh 18 kama leta hoon Uber se.
Me: *existential crisis begins*
Driver: Sahab, IT walon ko life mein sukh nahi milta. Subah 9 se raat 9.
Me: Bhai tum bhi toh subah se raat tak chalate ho.
Driver: Haan par main gaane sunke chalta hoon. Aap Excel sunke kaam karte ho.
Me: ...fair point.
Driver: Chodo sahab, sab moh maya hai. Main kal se YouTube channel start kar raha hoon.
Me: Sab wahi kar rahe hain bhai.`
  },
  {
    id: 13,
    title: "Online Shopping Returns",
    category: "Shopping",
    text: `Me: Hello, mujhe yeh product return karna hai.
Customer care: Sir, kya problem hai product mein?
Me: Bhai, maine blue order kiya tha, green aaya hai.
CC: Sir, woh lighting ka issue ho sakta hai.
Me: Bhai, mere ghar ki lighting mein blue cheez green nahi dikhti.
CC: Sir, aap ek baar dhoop mein dekh ke batao.
Me: Dhoop mein? Bhai main kya sundial dekh raha hoon?
CC: Sir, return window 7 din ki hai aur aapke 8 din ho gaye.
Me: Kal Sunday tha, count nahi hona chahiye!
CC: Sir, humari policy mein Sunday bhi din hota hai.
Me: Toh phir office kyun band rakhte ho Sunday ko?
CC: Sir, main aapki request escalate kar deta hoon. 3-5 business days.
Me: Pehle bhi 3-5 days bola tha, 15 din ho gaye.`
  },
  {
    id: 14,
    title: "Tuition Teacher Memories",
    category: "College",
    text: `Tuition teacher: Beta, homework kiya?
Me: Sir, woh actually...
Teacher: Actually kya? Nahi kiya na?
Me: Sir, light nahi thi.
Teacher: Toh mobile kaise chala rahe the? Tumhari mummy ne bataya.
Me: Sir woh...
Teacher: Aur tumhare dost Rahul ne WhatsApp pe status daala "Studying hard 📚". Tum dono saath mein PUBG khel rahe the na?
Me: Sir aap mere dost ka WhatsApp kaise dekhte hain?
Teacher: Meri beti tumhare class mein hai. Sab pata chalta hai.
Me: *sweating*
Teacher: Kal se double homework. Aur mobile mujhe de do class ke time.
Me: Sir yeh toh human rights violation hai.
Teacher: Beta, tumhari mummy se baat karoon? 
Me: Nahi sir, homework ho jayega.`
  },
  {
    id: 15,
    title: "Desi Wedding Shopping",
    category: "Shaadi",
    text: `Mummy: Beta, Rahul ki shaadi hai. Naya kurta lena hai.
Me: Mummy, mere paas 5 kurte hain already.
Mummy: Woh purane hain! Log kya kahenge?
Me: Log kurta nahi dekhte mummy, woh khana dekhte hain.
Mummy: Chup kar. Chal Sarojini chalte hain.
*At Sarojini Nagar*
Shopkeeper: Madam, yeh designer piece hai. 2000 ka.
Mummy: 200 mein doge?
Shopkeeper: Madam, kapda itne mein nahi aata.
Mummy: Toh kya? Mere bête ko ek ghante pehnaana hai bas.
Me: Mummy izzat rakh lo thodi.
Mummy: Izzat se discount nahi milta beta.
Shopkeeper: Madam, last price 800.
Mummy: 350.
Shopkeeper: *closes shop*
Mummy: Dekh, negotiate kaise karte hain. Woh wapas bulayega.`
  },
  {
    id: 16,
    title: "Parents vs WiFi",
    category: "Family",
    text: `Papa: Beta, WiFi nahi chal raha.
Me: Papa, router restart karo.
Papa: Kaise?
Me: Button hai peeche, press karo.
Papa: Kaunsa button? Yahan toh 3 hain.
Me: Woh power button hai papa, red wala.
Papa: Maine teeno daba diye.
Me: PAPA! Ab sab settings ud gayi!
Mummy: Kya hua? Mera serial buffer ho raha hai!
Me: Papa ne router ki surgery kar di.
Papa: Maine toh wohi kiya jo tune bola.
Me: Maine bola ek button dabao, aapne sab daba diye!
Papa: Beta, technology mein risk lena padta hai.
Mummy: Jaldi theek kar, Anupama aa rahi hai 8 baje.
Me: Mummy, Anupama se zyada important cheezein hain...
Mummy: *death stare*
Me: Haan theek karta hoon, 5 minute.`
  },
  {
    id: 17,
    title: "Zomato Delivery Drama",
    category: "Food",
    text: `*Phone rings*
Delivery boy: Sir, aapka order. Main gate pe hoon.
Me: Bhai, building ka naam bataya tha.
DB: Sir, yahan 5 building hain, sab same dikhti hain.
Me: Bhai, green wali building hai.
DB: Sir, andhera hai, sab building kaali dikh rahi hain.
Me: Bhai main balcony se haath hilata hoon.
DB: Sir, 50 log balcony mein khade hain, sab haath hila rahe hain.
Me: Bhai main torch on karta hoon.
DB: Sir ab 10 log torch on kar rahe hain.
Me: *comes downstairs*
DB: Sir, aapka order. 45 minute late sorry.
Me: Bhai, ice cream order ki thi...
DB: *hands over liquid*
Me: Yeh toh milkshake ban gaya.
DB: Sir, 5 star rating de do please 🙏`
  },
  {
    id: 18,
    title: "JEE/NEET Preparation",
    category: "College",
    text: `Papa: Beta, Kota jaana hai coaching ke liye.
Me: Papa, main commerce lena chahta hoon.
Papa: Commerce?! Woh toh backup plan hai!
Me: Papa, CA banunga main.
Papa: CA banne mein 10 saal lagte hain!
Me: Doctor banne mein bhi toh 10 saal lagte hain.
Papa: Haan par doctor ko log respect karte hain.
Me: CA ko bhi karte hain papa, especially tax season mein.
Papa: Beta, Sharma ji ka beta...
Me: Papa please, Sharma ji ka beta nahi!
Papa: Sharma ji ka beta AIIMS mein hai.
Me: Papa, Sharma ji ka beta depression mein bhi hai.
Papa: Woh toh sab students ko hota hai.
Me: That's... that's not the flex you think it is, Papa.
Mummy: Kuch bhi karo, government job karo.
Me: Mummy, 2024 hai...
Mummy: Government job timeless hai beta.`
  },
  {
    id: 19,
    title: "Parking Lot Argument",
    category: "Street",
    text: `Me: Bhaiya, yeh meri jagah hai, main pehle aaya tha.
Uncle: Nahi beta, maine indicator daala tha.
Me: Uncle, indicator daalne se jagah book nahi hoti.
Uncle: Beta, main yahan 20 saal se park karta hoon.
Me: Uncle, yeh mall ka parking hai, 20 saal pehle yahan khet tha.
Uncle: Matlab? Khet tha toh bhi mera tha.
Me: Uncle, aapki Wagon R hai, itni jagah kyun chahiye?
Uncle: Beta, Wagon R ki bhi izzat hoti hai.
Guard: Saab, dono side mein jagah hai.
Uncle: Nahi, yeh MERI jagah hai. Shade mein hai.
Me: Uncle shade ke liye aap ladh rahe hain?
Uncle: Beta, tum nahi samjhoge. 45 degree mein gaadi park karke dekho.`
  },
  {
    id: 20,
    title: "Arrange Marriage Meeting",
    category: "Shaadi",
    text: `*At the girl's house*
Girl's papa: Beta, kya karte ho?
Me: Uncle, software developer hoon.
Girl's papa: Package?
Me: Uncle, 12 LPA.
Girl's papa: Hmm, Sharmaji ka ladka 25 LPA...
Me: Uncle, woh Amazon mein hai, 18 ghante kaam karta hai. Per hour rate mera zyada hai.
Girl's mummy: Beta, khana banate ho?
Me: Aunty, Maggi bana leta hoon.
Girl: *whispers* Same.
Girl's papa: Ghar hai? Gaadi hai?
Me: Uncle, EMI hai dono pe. Technically bank ka hai.
Girl's papa: Beta, shaadi ke baad kahan rahoge?
Me: Uncle, rent pe. South Bangalore mein.
Girl's papa: Rent? Apna ghar nahi hai?
Me: Uncle, Bangalore mein ghar lena matlab kidney bechna.
Girl: *laughing*
Girl's papa: *not laughing*`
  },
  {
    id: 21,
    title: "Desi Mom WhatsApp",
    category: "Family",
    text: `*Mom sends Good Morning image with roses at 5:30 AM*
Mummy: 🌹🌸 Good Morning Beta 🌸🌹 Jai Shree Krishna 🙏
Me: Mummy subah ke 5:30 baj rahe hain.
Mummy: Beta jaldi uthna accha hota hai.
Me: Mummy main 3 baje soya hoon, kaam kar raha tha.
Mummy: 3 baje?! Kya kaam hota hai 3 baje?
Me: Mummy, US client hai, unka time alag hai.
Mummy: US ke logon ko bhi toh sona chahiye!
*Sends another image*
Mummy: Yeh dekh, turmeric milk peena chahiye raat ko.
Me: Ok mummy.
Mummy: Aur yeh article padh - "10 reasons why your generation is unhealthy"
Me: Mummy yeh fake news hai.
Mummy: WhatsApp pe aaya hai toh sach hi hoga.
Me: That's... not how it works.
Mummy: Padh le warna bimaari hogi.`
  },
  {
    id: 22,
    title: "Movie Theatre Experience",
    category: "Entertainment",
    text: `*At PVR*
Me: Bhai, ek popcorn kitne ka hai?
Counter: Sir, regular 350, large 550.
Me: 350 ka popcorn? Bhai yeh gold-plated hai kya?
Counter: Sir, combo loge toh sasta padega. Popcorn + Coke = 600.
Me: Separately kitna hota?
Counter: 350 + 300 = 650. So combo mein 50 bach rahe hain.
Me: Matlab tum mujhe 50 rupaye bachane ke liye 600 spend karwa rahe ho?
Counter: Sir, value for money hai.
Me: Bhai, ghar pe 30 rupaye mein 3 baar popcorn banta hai.
Counter: Sir, ghar pe AC nahi hai na screen jaisa.
Me: Bhai AC ke liye 500 ka ticket hai already.
*Person behind*: Bhaiya jaldi karo, interval mein aaye hain.
Me: *buys the combo reluctantly*`
  },
  {
    id: 23,
    title: "Society Meeting Drama",
    category: "Neighbourhood",
    text: `Secretary: Aaj ki meeting mein water tank ka issue discuss karenge.
Sharma uncle: Pehle parking ki baat karo!
Gupta aunty: Parking nahi, yeh dog wale log problem hain. Subah se poop!
Dog owner: Aunty, main toh saaf karta hoon!
Gupta aunty: Kal aapka Tommy mere gaadi pe baitha tha!
Secretary: Please, ek ek karke boliye.
Verma ji: Maintenance badhao! Lift kaam nahi karti.
Secretary: Verma ji, aap ground floor pe rehte ho.
Verma ji: Toh kya? Mera bhi paisa lagta hai!
Sharma uncle: Main keh raha hoon, guest parking mein residents park kar rahe hain!
Gupta aunty: Aapki gaadi 3 jagah leti hai Sharma ji, Scorpio hai ya ship?
Secretary: *head in hands*
Me: *eating samosa, enjoying the show*`
  },
  {
    id: 24,
    title: "Cricket Gully Match",
    category: "Cricket",
    text: `Rohit: Out hai! LBW!
Bunty: LBW kaise? Tennis ball hai, koi LBW nahi hota gully mein!
Rohit: Rule hai humara. Pad pe lagi, out!
Bunty: Pad? Bhai main chaddi mein khel raha hoon, kaunsa pad?
Fielder: Bhai jaldi karo, aunty ne 6 baje tak ground khaali karne bola hai.
Rohit: Tujhe batting karni hai toh out maan le.
Bunty: Nahi maan raha. Pehle wicket giri toh maan lunga.
Rohit: Wicket toh dustbin hai, woh gir nahi sakti!
Bunty: Toh phir LBW kaise dega?
Rohit: Bhai tu har baar cheating karta hai.
Bunty: Main cheating?! Tu bhai no-ball pe wicket liya tha pichli baar!
*Ball goes into Sharma aunty's balcony*
Everyone: Match khatam. 🏃‍♂️`
  },
  {
    id: 25,
    title: "Late Night Maggi Session",
    category: "Flatmates",
    text: `*2 AM in hostel*
Arun: Bhai, bhookh lagi hai.
Vikram: Maggi banate hain?
Arun: Maggi khatam ho gayi.
Vikram: Kaise? Kal 12 packets laye the!
Arun: Woh Deepak ne 6 khaye, Rahul ne 4.
Vikram: Aur 2?
Arun: Woh... maine khaye.
Vikram: Bhai tu toh diet pe tha!
Arun: Raat ko diet break hota hai bhai. International rule hai.
Vikram: Chal canteen chalte hain.
Arun: Canteen 11 baje band ho gaya.
Vikram: Dominos?
Arun: Minimum order 199, mere paas 43 rupaye hain.
Vikram: Mere paas 22.
Arun: 65 rupaye mein kya aayega?
Vikram: Parle-G aur water.
Arun: *orders Parle-G from Blinkit*
Vikram: Delivery charge 30 rupaye.
Both: *sleeps hungry*`
  },
  {
    id: 26,
    title: "Barber Shop Talk",
    category: "Street",
    text: `Barber: Bhai, kaise katne hain?
Me: Bhai, thode chhote kar do sides se.
Barber: Aur upar se?
Me: Upar se mat kaatna, bus trim.
*10 minutes later*
Barber: Yeh dekho, kaisa lag raha hai?
Me: Bhai... yeh toh bahut chhota ho gaya!
Barber: Bhai aapne bola tha chhota karo.
Me: Sides se! Upar se nahi!
Barber: Bhai, ab upar se bhi karna padega, nahi toh weird lagega.
Me: Matlab tum galti karoge aur main uski saza bhugatunga?
Barber: Bhai, 2 hafte mein wapas aa jayenge.
Me: 2 hafte main cap pehen ke ghumunga?
Barber: Bhai, 200 rupaye.
Me: 200?! Tune toh saara maal kaata hai, kam hona chahiye!
Barber: Bhai, skill ke paise hain, baal ke nahi.`
  },
  {
    id: 27,
    title: "School Reunion Chat",
    category: "Friends",
    text: `*WhatsApp Group: "Class of 2015 Forever ❤️"*
Neha: Guys, reunion plan karte hain!
*Read by 45, replied by 3*
Neha: Hello?? Koi hai?
Mohit: Haan bhai, kab?
Neha: Next Saturday?
Aman: Bhai mere bacche hain, Saturday nahi ho payega.
Mohit: Bhai tujhe bacche kab hue? Tu toh 2020 tak single tha!
Aman: Bhai, lockdown mein sab hua.
Neha: Location suggest karo.
Mohit: Cafe Coffee Day?
Aman: Bhai hum 28 ke hain, CCD nahi.
Neha: Koi dhang ki jagah batao.
Mohit: Bar?
Aman: Bhai meri biwi ko pata chalega.
Mohit: Tu biwi ke saath aa ja.
Aman: Phir reunion ka kya matlab?
Neha: Main plan cancel kar rahi hoon.`
  },
  {
    id: 28,
    title: "Doctor Visit Drama",
    category: "Health",
    text: `Doctor: Kya problem hai?
Me: Sir, pet mein dard hai.
Doctor: Kya khaaya kal?
Me: Sir... pani puri, chole bhature, momos, aur raat ko pizza.
Doctor: Aur?
Me: Aur ice cream.
Doctor: Beta, tum doctor ke paas aaye ho ya food review dene?
Me: Sir dard bahut hai.
Doctor: Spicy khana band karo.
Me: Sir, spicy khana band matlab zindagi band.
Doctor: Zindagi lambi chahiye ya spicy?
Me: Can I have both?
Doctor: No.
Me: Sir, koi aisi medicine hai jo dono de de?
Doctor: Beta, medicine hai, jaadu nahi.
Me: Sir, fees kitni hai?
Doctor: 500.
Me: Sir woh toh pani puri ke 50 plate aa jaate.
Doctor: Yehi soch badalni hai beta.`
  },
  {
    id: 29,
    title: "PG/Hostel Water Problem",
    category: "Flatmates",
    text: `*6 AM*
Roommate 1: Bhai paani nahi aa raha!
Roommate 2: Kya?! Mera interview hai aaj!
Roommate 1: Bucket mein thoda bacha hai.
Roommate 2: Kitna?
Roommate 1: Bhai ek lota.
Roommate 2: Ek lota mein main kya karunga?!
Roommate 1: Face wash aur ek haath dho le.
Roommate 3: Bhai, main kal se bata raha tha tanki khaali hai.
Roommate 2: Toh bharna tha na!
Roommate 3: Main plumber thodi hoon!
Landlord (on call): Haan beta, paani shaam ko aayega.
Roommate 2: Shaam ko?! Mera interview 10 baje hai!
Landlord: Bisleri use kar lo beta.
Roommate 2: Bisleri se nahaun?!
Landlord: Mineral water bath. Premium PG hai tumhara. Extra charge nahi lunga.`
  },
  {
    id: 30,
    title: "Tinder in India",
    category: "Dating",
    text: `*Tinder chat*
Me: Hey! Nice profile 😊
Girl: Thanks! What do you do?
Me: Software engineer. You?
Girl: CA final.
Me: Nice! So we can be broke together 😂
Girl: 😂 Where are you from?
Me: Delhi, you?
Girl: Same! Which area?
Me: Dwarka.
Girl: Oh, Dwarka toh bahut door hai.
Me: Door? Tum kahan ho?
Girl: Rohini.
Me: Bhai, yeh toh same city hai. Door kaise?
Girl: Delhi mein Dwarka se Rohini jaana = long distance relationship hai.
Me: True. Metro mein 1.5 ghanta.
Girl: Haan toh basically humara relationship commute hi hoga.
Me: Chalega, metro mein seat mil jaaye toh date bhi ho jaayegi.
Girl: *unmatches*`
  },
  {
    id: 31,
    title: "Online Exam Cheating",
    category: "College",
    text: `*WhatsApp during online exam*
Raj: Bhai, Q4 ka answer kya hai?
Me: Bhai, mujhe khud nahi aata.
Raj: Google kar na!
Me: Bhai, proctored exam hai, camera on hai.
Raj: Phone se Google kar, laptop se exam de.
Me: Bhai, phone camera bhi on hai!
Raj: Toh washroom ja, wahan Google kar.
Me: Bhai, washroom break 2 minute ka hai, syllabus 200 pages ka.
Raj: Bhai, pichle saal ka paper same hai na?
Me: Nahi bhai, teacher ne iss baar original questions daale hain.
Raj: Original?! Yeh toh dhoka hai students ke saath.
Me: Dhoka students nahi, cheaters ke saath hai.
Raj: Same thing bhai.
Me: Padhai kar leta toh yeh din nahi aata.
Raj: Woh option exist nahi karta mere universe mein.`
  },
  {
    id: 32,
    title: "Middle Seat on Flight",
    category: "Travel",
    text: `*On IndiGo flight*
Me: Excuse me, I have the middle seat.
Window guy: *has headphones, ignores*
Aisle guy: *sleeping*
Me: Bhai... BHAI!
Aisle guy: Haan?
Me: Mujhe andar jaana hai.
Aisle guy: *stands up with maximum inconvenience*
*Settles in middle seat*
Window guy: *takes both armrests*
Aisle guy: *also takes armrest*
Me: Main kya karun? Haath godi mein rakhun?
*Flight attendant arrives*
FA: Sir, kya lenge? Veg ya non-veg?
Me: Kya farak padta hai, dono mein taste nahi hai.
FA: *professional smile*
Window guy: *opens window shade, sun hits my face*
Me: Bhai band kar.
Window guy: Bhai, mera window hai.
Me: Bhai, mera face hai.`
  },
  {
    id: 33,
    title: "Landlord vs Tenant",
    category: "Neighbourhood",
    text: `Landlord: Beta, rent badhna hai next month se.
Me: Uncle, kitna?
Landlord: 2000 zyada.
Me: Uncle, inflation itna nahi hai.
Landlord: Beta, market rate hai.
Me: Uncle, market rate mein AC kharab, geyser kharab, aur bathroom mein leakage bhi fix ho jaani chahiye.
Landlord: Woh toh minor issues hain beta.
Me: Uncle, bathroom mein waterfall ban raha hai. Woh minor nahi hai.
Landlord: Beta, Shimla feel aata hoga na. Free mein.
Me: Uncle, Shimla mein rent bhi kam hai.
Landlord: Beta, maintenance ke paise alag hain.
Me: Maintenance? Uncle, lift 6 mahine se band hai!
Landlord: Beta, stairs se health banti hai.
Me: Uncle, main 5th floor pe rehta hoon, har din Everest chadh raha hoon.
Landlord: Toh fit rahoge beta. Gym ki zaroorat nahi. Gym ka paisa bach raha hai.`
  },
  {
    id: 34,
    title: "Instagram Influencer Reality",
    category: "Entertainment",
    text: `Priya: Guys, main influencer ban rahi hoon!
Me: Kitne followers hain?
Priya: 847.
Me: Woh toh tere school ke batch se kam hai.
Priya: Content se badhenge. Maine aesthetic feed banayi hai.
Me: Maine dekha, saari photos same pose hain. Bas background alag hai.
Priya: Woh consistency kehte hain.
Me: Woh laziness kehte hain.
Priya: Brand collaborations aa rahi hain!
Me: Konsi brand?
Priya: Ek tooth powder company. Barter deal hai.
Me: Matlab free tooth powder milega?
Priya: Haan, aur exposure.
Me: Exposure se rent nahi bharta Priya.
Priya: Tu nahi samjhega. Main next Kusha Kapila hoon.
Me: Kusha Kapila ke 3 million hain. Tere 847.
Priya: Journey of a thousand miles begins with one step.
Me: Haan, par tera step tooth powder hai.`
  },
  {
    id: 35,
    title: "Engineering Viva",
    category: "College",
    text: `Professor: Linked list kya hota hai?
Me: Sir, ek data structure hai jisme...
Professor: Practical batao.
Me: Sir, jaise WhatsApp mein messages linked hote hain...
Professor: WhatsApp?! Textbook padhi hai?
Me: Sir, YouTube se padha hai.
Professor: YouTube se? Konsa channel?
Me: Sir, CodeWithHarry.
Professor: Harry ne kya bataya?
Me: Sir, wohi bataya jo aapne nahi bataya class mein.
Professor: *death stare*
Me: Sir matlab... additional knowledge sir.
Professor: Doubly linked list batao.
Me: Sir, jaise rishta - dono taraf se connected, par koi bhi kisi bhi time chhodh sakta hai.
Professor: *trying not to laugh*
Professor: Marks nahi dunga tujhe.
Me: Sir, linked list ki tarah meri marks bhi null point kar doge?
Professor: Nikal ja baahar.`
  },
  {
    id: 36,
    title: "Petrol Pump Visit",
    category: "Street",
    text: `Me: Bhaiya, 500 ka petrol daal do.
Attendant: Sir, full tank kar dein?
Me: Bhai, full tank ka matlab mere hafte ki salary chali jayegi.
Attendant: Sir, petrol sasta ho gaya hai.
Me: Bhai, 105 se 103 hua hai. Yeh sasta nahi, kam mehnga hai.
Attendant: Sir, air check karwa lo? Free hai.
Me: Bhai, petrol ke rate mein air bhi free nahi lagti.
*Bill comes*
Me: Bhai, 500 bola tha, 520 ka daala!
Attendant: Sir, woh machine mein thoda extra aa jaata hai.
Me: Machine mein extra aata hai ya tumhari pocket mein?
Attendant: Sir, receipt chahiye?
Me: Haan, proof chahiye ki 520 rupaye mein kuch nahi mila.
Attendant: Sir, 2 litre mila hai.
Me: 2 litre?! Bhai pani bhi 2 litre ka 20 rupaye hai.
Attendant: Sir, pani se gaadi nahi chalti.
Me: Meri gaadi petrol se bhi mushkil se chalti hai.`
  },
  {
    id: 37,
    title: "Wedding DJ Requests",
    category: "Shaadi",
    text: `DJ: Haan bhai, konsa gaana?
Uncle: "Tamma Tamma" bajao!
DJ: Uncle, 2024 hai...
Uncle: Gaana evergreen hai beta.
Aunty: "London Thumakda" bajao!
DJ: Abhi toh baja tha aunty.
Aunty: Phir se bajao, mera step adhura reh gaya.
Me: Bhai, koi English gaana baja de.
Uncle: English?! Yeh Indian wedding hai!
Cousin: AP Dhillon baja do!
Uncle: Yeh kaun hai?
Cousin: Punjabi singer hai uncle.
Uncle: Toh Punjabi bajao na, English kyun bol raha hai?
DJ: Bhai sab ke request alag hain, main kya bajaunga?
Papa: "Ye Desh Hai Veer Jawanon Ka" baja de.
Everyone: Papa/Uncle ji, please!
DJ: *plays Badshah*
*Everyone dances anyway*`
  },
  {
    id: 38,
    title: "Morning Walk Uncles",
    category: "Health",
    text: `Uncle 1: Aaj 5 round lagai!
Uncle 2: Maine 7 lagai.
Uncle 1: 7?! Kal toh 3 mein haanph raha tha!
Uncle 2: Woh kal ki baat thi. Aaj protein shake piya subah.
Uncle 1: Protein shake? Biwi ne banaaya?
Uncle 2: Nahi, Amazon se mangwaya. Chocolate flavour.
Uncle 1: Chocolate? Woh toh bacchon ka hai.
Me: *jogging past* Good morning uncles.
Uncle 1: Beta, itni jaldi? Subah 5 baje?
Me: Haan uncle, exercise karna hai.
Uncle 2: Beta, exercise nahi, yeh tapaak hai. Walking karo, jogging se ghutne kharab hote hain.
Uncle 1: Haan, humari umar mein pata chalega.
Me: Uncle aap toh chai aur samosa kha rahe hain bench pe.
Uncle 1: Beta, yeh post-workout meal hai.
Uncle 2: Carbs chahiye walk ke baad.
Me: Uncle, aapne toh abhi 7 round ka jhooth bola.
Uncle 2: Beta, respect your elders.`
  },
  {
    id: 39,
    title: "Indian Airport Scene",
    category: "Travel",
    text: `*Boarding gate*
Announcement: Gate 14, boarding for flight 6E-234.
*Everyone stands up immediately*
Me: Bhai, zone 3 hai humara, abhi zone 1 bol rahe hain.
Papa: Chalo beta, line mein lag jao.
Me: Papa, hamara number nahi aaya.
Papa: Haan toh aayega tab tak line mein rehna chahiye. Nahi toh jagah nahi milegi.
Me: Papa, assigned seats hain. Jagah fix hai.
Papa: Beta, cabin mein bag rakhne ki jagah? Pehle aayega pehle paayega.
Me: Papa, ek backpack hai humara.
Papa: Toh kya? Principle ki baat hai.
*Stands in line for 25 minutes*
*Finally boards*
Papa: Dekha? Humne bag upar rakh liya!
Me: Papa, plane khaali hai. Sab jagah khaali hai.
Papa: Preparation hoti hai beta. Life lesson hai yeh.`
  },
  {
    id: 40,
    title: "Electricity Bill Shock",
    category: "Family",
    text: `Papa: YEEEH KYA HAI?! 8000 ka bijli bill?!
Me: Papa, AC chala rahe the na...
Papa: AC toh 26 pe tha!
Me: Papa, 26 pe tha par 24x7 chala rahe the.
Papa: 24x7?! Kaun chalata hai?!
Mummy: Maine toh sirf raat ko chalaya.
Papa: Raat ko matlab 6 PM se subah 8 AM. Yeh "sirf raat" hai?
Me: Papa, garmi thi bahut...
Papa: Garmi hai toh pankha chalao! Humare zamane mein AC nahi tha.
Me: Papa, aapke zamane mein 50 degree nahi hota tha.
Papa: Kal se AC band. Cooler chalega.
Me: Papa, cooler se aur garmi lagti hai!
Papa: Garmi lagti hai toh matka ka paani piyo.
Mummy: Fridge ka paani bhi band?
Papa: Fridge bhi band! Sab band!
Me: Papa, fridge mein khana hai...
Papa: Toh jaldi kha lo!`
  },
  {
    id: 41,
    title: "Cousin's Baby Naming Ceremony",
    category: "Family",
    text: `Dadi: Naam Ramesh rakho!
Mummy: Mummy ji, aajkal ke bacchon ka Ramesh nahi rakhte.
Dadi: Kyun? Ramesh kya bura naam hai?
Papa: Mummy ji, kuch modern rakhte hain. Aarav?
Dadi: Aarav? Yeh kya naam hai? Matlab kya hai?
Me: Dadi, matlab peaceful.
Dadi: Peaceful? Yeh baccha raat bhar rota hai, isme peaceful kya hai?
Chacha: Vihaan rakho.
Dadi: Woh Sharma ji ke pote ka naam hai!
Bua: Reyansh?
Dadi: Yeh toh serial wala naam hai.
Me: Dadi, aap bolo kya rakhein?
Dadi: Ramesh.
Everyone: 🙄
Baby: *cries*
Dadi: Dekha? Ramesh sun ke ro raha hai khushi se.
Me: Dadi, woh hungry hai.
Dadi: Ramesh hungry nahi hota. Strong naam hai.`
  },
  {
    id: 42,
    title: "Desi Mom Cooking Battle",
    category: "Food",
    text: `Me: Mummy, aaj bahar se khaana mangwa lete hain.
Mummy: Kyun? Mera khaana accha nahi hai?
Me: Nahi mummy, aaj mann nahi hai banana ka.
Mummy: Mera mann 25 saal se nahi hai, phir bhi bana rahi hoon.
Me: Mummy, Zomato pe offer hai...
Mummy: Offer? Mera ghar ka khaana free hai, usse bada offer kya hoga?
Me: Mummy, pizza khaana hai bas.
Mummy: Pizza? Ghar pe bana dungi. Roti pe cheese daal dungi.
Me: Mummy woh pizza nahi hai...
Mummy: Toh kya hai? Base hai, topping hai, cheese hai. Pizza hi toh hai.
Me: Mummy, dough alag hota hai.
Mummy: Dough? Atta hai atta. Sab same hai.
*Makes roti pizza*
Me: *eats it*
Mummy: Kaisa hai?
Me: ...actually accha hai.
Mummy: Hamesha accha hota hai. Zomato wale kya banaayenge.`
  },
  {
    id: 43,
    title: "OLA/Uber Cancel Drama",
    category: "Street",
    text: `*Ola booked*
App: Driver is 3 minutes away.
*5 minutes later*
App: Driver is 2 minutes away.
*10 minutes later*
*Phone rings*
Driver: Sahab, cancel kar do.
Me: Kyun bhai?
Driver: Sahab, route nahi jaata main udhar.
Me: Bhai, 3 km hai bas.
Driver: Sahab, udhar traffic hai.
Me: Bhai, Google Maps pe green dikha raha hai.
Driver: Sahab, woh real-time nahi hai. Mujhe pata hai.
Me: Bhai, tum 10 minute se khade ho, utne mein pahunch jaate.
Driver: Sahab, aap cancel karo please. Mujhe penalty lagti hai.
Me: Mujhe bhi toh cancel charge lagega!
Driver: Sahab, aap customer ho, complaint kar lena.
Me: Complaint se refund nahi milta bhai.
Driver: Sahab, main aapko blessing de raha hoon. God bless you.
*Cancels. Next driver is 15 minutes away*`
  },
  {
    id: 44,
    title: "Relative's Kid Comparison",
    category: "Family",
    text: `Aunty: Beta, meri Chintu ne drawing competition jeeta!
Me: Oh nice, kitne bacche the competition mein?
Aunty: 3.
Me: ...
Aunty: Par sabse accha draw kiya usne. Elephant banaaya!
Me: Aunty, woh elephant hai? Mujhe toh cloud laga.
Aunty: Beta, abstract art hai. Tum nahi samjhoge.
Aunty: Tumne kya kiya bachpan mein?
Me: Aunty, main National Science Olympiad mein aaya tha.
Aunty: Science? Woh toh boring hai. Art mein creativity chahiye.
Me: Aunty, science mein bhi creativity chahiye.
Aunty: Nahi beta, science mein toh ratta maaro.
Me: *deep breath*
Aunty: Waise beta, tumhari shaadi kab hai?
Me: Aunty, topic change mat karo.
Aunty: Topic nahi, life stage change karo beta.`
  },
  {
    id: 45,
    title: "Startup Pitch Gone Wrong",
    category: "Office",
    text: `Founder: So our startup is Uber for chai.
Investor: Matlab?
Founder: Sir, app se chai order karenge log. 10 minute mein delivery.
Investor: Tapri pe 2 minute mein milti hai.
Founder: Sir, par convenience!
Investor: Bhai, tapri har gali mein hai. Usse convenient kya hoga?
Founder: Sir, premium chai. Organic ingredients.
Investor: Organic chai 200 rupaye ki? Tapri pe 15 mein milti hai.
Founder: Sir, experience sell kar rahe hain.
Investor: Bhai, tapri pe bhi experience hota hai. Baarish mein cutting chai. Woh experience free hai.
Founder: Sir, humara app AI-powered hai.
Investor: AI chai banaata hai?
Founder: Nahi sir, AI recommend karta hai konsi chai piyo.
Investor: Bhai, mujhe khud pata hai mujhe adrak wali chahiye.
Founder: Sir, data analytics bhi hai.
Investor: Data se chai meethi nahi hoti bhai. Next!`
  },
  {
    id: 46,
    title: "Desi Parents at Airport",
    category: "Travel",
    text: `*Dropping parents at airport*
Papa: Beta, check-in kab hota hai?
Me: Papa, 3 ghante pehle.
Papa: 3 ghante?! Flight 10 baje hai, hum 5 baje kyun aaye?
Mummy: Safety ke liye. Agar kuch ho jaaye.
Me: Kya ho jaayega mummy? Airport hai, war zone nahi.
Papa: Beta, trolley le. Mummy ka ek bag hai.
Me: Papa, yeh ek bag nahi hai. Yeh 4 suitcase, 2 handbag, aur ek dabbé mein achar hai.
Mummy: Achar zaruri hai! America mein achar nahi milta.
Me: Milta hai mummy, Amazon pe.
Mummy: Amazon ka achar aur ghar ka achar same hai?
Me: Nahi...
Papa: Dekha? Isliye 5 kg achar le jaana zaroori hai.
Security: Ma'am, liquid items allowed nahi hain.
Mummy: Yeh liquid nahi hai, yeh achar hai!
Security: Ma'am, oil hai usme.
Mummy: *looks at me* Yeh desh kharab ho gaya hai. Achar bhi nahi le jaane dete.`
  },
  {
    id: 47,
    title: "College Canteen Politics",
    category: "College",
    text: `Me: Bhai, aaj canteen mein kya hai?
Canteen wala: Rajma chawal, chole, aur pasta.
Me: Pasta kaise hai?
Canteen wala: Best hai bhai, Italian style.
Me: Bhai, pichli baar Italian style mein Maggi masala mila tha.
Canteen wala: Woh fusion hai bhai.
Me: Fusion? Bhai woh crime hai.
Friend: Rajma chawal le, safe hai.
Me: Rajma mein bhi kal kidney beans ki jagah lobia tha.
Canteen wala: Bhai, same family hai.
Me: Bhai, gorilla aur human bhi same family hai. Same nahi hai.
Canteen wala: Bhai, 50 rupaye mein 5 star chahiye?
Me: 5 star nahi, edible chahiye.
Canteen wala: Kha lo bhai, yeh MBA canteen hai. IIT wale 30 mein khaate hain.
Me: IIT wale 1 crore kamaate bhi hain baad mein.
Canteen wala: Toh tum bhi kamao, phir bahar khaana. Abhi yeh khao.`
  },
  {
    id: 48,
    title: "Weekend Plan Failures",
    category: "Friends",
    text: `*Friday night group chat*
Arjun: Guys, kal kya plan hai?
Kunal: Bhai, trek chalte hain!
Arjun: Bhai, mai soya nahi 2 din se. Trek nahi.
Ananya: Movie chalte hain.
Kunal: Konsi?
Ananya: Jo bhi.
Kunal: "Jo bhi" naam ki koi movie nahi hai. Batao konsi.
Me: Netflix pe dekh lete hain ghar pe.
Arjun: Bhai, Netflix pe sab dekh liya.
Me: Amazon Prime?
Arjun: Woh bhi.
Kunal: Hotstar?
Arjun: Bhai tu kaam kab karta hai? Saari OTT khatam kar di?
Arjun: WFH hai bhai, background mein chalta hai.
*Saturday morning*
Ananya: Guys ready?
*silence*
Ananya: Hello??
Kunal: Bhai, mummy ne kaam laga diya.
Arjun: Bhai, neend nahi khuli.
Me: Bhai, mera plan cancel.
Ananya: Har hafte yehi hota hai. Bye.`
  },
  {
    id: 49,
    title: "Vegetarian at Non-Veg Restaurant",
    category: "Food",
    text: `Waiter: Sir, menu.
Me: Bhai, veg mein kya hai?
Waiter: Sir, paneer butter masala, dal fry, aur salad.
Me: Bas? 50 items ka menu hai, 3 veg?
Waiter: Sir, yeh non-veg specialty restaurant hai.
Me: Toh menu pe "Multi-cuisine" kyun likha hai?
Waiter: Sir, multi matlab chicken multi-way mein banta hai.
Friend: Bhai, chicken try kar. Life mein ek baar.
Me: Bhai, 25 saal se nahi khaya, aaj kyun?
Friend: YOLO bhai.
Me: YOLO ka matlab vegetarian food accha banana nahi hai.
Waiter: Sir, paneer tikka hai, bahut accha hai.
Me: Bhai, paneer tikka toh har jagah milta hai.
Waiter: Sir, humaara special hai.
*Paneer tikka arrives*
Me: Bhai, yeh toh same paneer hai jo sab jagah milta hai.
Waiter: Sir, plate alag hai humari.
Me: 💀`
  },
  {
    id: 50,
    title: "Indian Tech Support Call",
    category: "Office",
    text: `Me: Hello, mera laptop slow chal raha hai.
Tech support: Sir, restart kiya?
Me: Haan, 5 baar.
TS: Sir, RAM kitni hai?
Me: 8 GB.
TS: Sir, Chrome mein kitne tabs khule hain?
Me: ...47.
TS: SIR. 47 TABS.
Me: Bhai, sab zaroori hain!
TS: Sir, 47 mein se 30 toh YouTube ke hain.
Me: Woh research ke liye hain.
TS: Sir, "Cat videos compilation" research hai?
Me: Bhai, mera kaam alag hai.
TS: Sir, kuch tabs band karo.
Me: Nahi, mujhe sab chahiye. Kuch aur solution batao.
TS: Sir, aur RAM lagwao.
Me: Kitne ki aayegi?
TS: 3000 ki.
Me: 3000?! Bhai laptop 25000 ka hai.
TS: Sir, toh naya laptop lo.
Me: Iske liye call kiya tha main?
TS: Sir, call ka charge 200 rupaye. Payment link bhej raha hoon.
Me: ...`
  }
];
