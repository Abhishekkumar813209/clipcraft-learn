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
  },
  {
    id: 51,
    title: "Story Reply Opener",
    category: "Snapchat",
    text: `*She posts a sunset story*
Me: Nice view 👀
She: Thanks!
Me: Main sunset ki baat kar raha tha, tum kya samjhi? 😏
She: 😂 Shut up
Me: Arey seriously though, yeh kahan ka hai?
She: Marine Drive
Me: Oh nice, main bhi kal wahi tha. Humne ek dusre ko miss kar diya.
She: Haha sure
Me: I mean sunset ko miss kiya, tum toh stranger ho abhi
She: "Abhi" matlab baad mein nahi rahungi?
Me: Depends, next story kab daal rahi ho?`
  },
  {
    id: 52,
    title: "Streak Negotiation",
    category: "Snapchat",
    text: `Me: Streak?
She: Haan chalo
*Day 1-5: Normal snaps*
*Day 6*
Me: Yeh streak toh arrange marriage jaisi hai. Roz milna padta hai bina kuch bole.
She: 😂 Toh baat bhi kar liya karo
Me: Accha toh batao, aaj kya kiya?
She: Kuch nahi, bore ho rahi thi
Me: Same. Isliye streak bheja. Productivity level: Negative.
She: At least honest ho
Me: Honesty meri weakness hai. Isliye single hoon.
She: 💀💀
Me: Ab has mat, streak bhejo wapas. Timer laga hai.`
  },
  {
    id: 53,
    title: "Bitmoji Roast",
    category: "Snapchat",
    text: `Me: Tera bitmoji tujhse accha dikhta hai
She: Excuse me?! 😤
Me: Arey compliment hai! Tera bitmoji cute hai. Very well made.
She: Toh main cute nahi hoon?
Me: Maine aisa kab bola? Main bola bitmoji ZYADA cute hai. Tu bhi cute hai, bas thoda kam.
She: I'm blocking you
Me: Block karegi toh streak tootega, 45 din ki mehnat 🥲
She: Tumhe meri ya streak ki zyada chinta hai?
Me: Honest answer chahiye ya diplomatic?
She: Honest
Me: ...streak.
She: 😂 BYE`
  },
  {
    id: 54,
    title: "Late Reply Drama",
    category: "Snapchat",
    text: `*Sent message at 2 PM*
*She replies at 11 PM*
She: Hii sorry late reply, phone nahi tha paas mein
Me: Koi baat nahi, main bhi abhi 9 ghante baad padh raha hoon tumhara message
She: 😂 Itna sarcasm
Me: Sarcasm nahi, patience hai. Monks bhi itna wait nahi karte.
She: Busy thi yaar
Me: Main bhi busy tha. Teri reply ka wait karne mein.
She: Aww 🥺
Me: Aww mat bol, next time 8 ghante mein reply kar dena. Baby steps.
She: Deal 😂
Me: Screenshot le raha hoon, evidence ke liye.`
  },
  {
    id: 55,
    title: "Snap Map Stalking",
    category: "Snapchat",
    text: `Me: CP mein ho?
She: Tumhe kaise pata? 😳
Me: Snap Map
She: You check my location?! 👀
Me: Accidentally dikha. Main apni location dekh raha tha aur tumhara bitmoji naach raha tha CP pe.
She: Bitmoji naachta nahi hai 😂
Me: Mujhe laga party chal rahi hai.
She: Tum bhi aa jao phir
Me: Abhi? Bhai main pajama mein hoon.
She: Toh kapde pehen lo
Me: Instructions unclear. Kaunse kapde? Date wale ya "just a friend" wale?
She: 🤦‍♀️ Just come
Me: Omw. Pajama mein.`
  },
  {
    id: 56,
    title: "Gym Selfie Comment",
    category: "Snapchat",
    text: `*She posts gym story*
Me: Yeh toh bahut heavy workout lag raha hai
She: Haan! 1 hour cardio kiya
Me: Main toh sirf story dekhke thak gaya
She: 😂 Tum gym nahi jaate?
Me: Jaata hoon. Mentally. Roz visualize karta hoon.
She: Visualization se muscles nahi bante
Me: But confidence banta hai. Aur confidence > muscles
She: Cope 😂
Me: Arey genuine question - tum log gym jaake selfie pehle lete ho ya workout?
She: Dono saath mein
Me: Multi-tasking queen 👑
She: Tum bhi try karo gym
Me: Theek hai, pehle selfie lena seekhta hoon.`
  },
  {
    id: 57,
    title: "Food Story React",
    category: "Snapchat",
    text: `*She posts pizza story*
Me: Cheese burst?
She: Haan! 🍕
Me: Akele kha rahi ho? That's illegal in India. Sharing is mandatory.
She: Doston ke saath hoon
Me: Oh toh main dost nahi hoon? Noted. 📝
She: Abhi abhi toh baat shuru hui hai 😂
Me: Pizza ke liye main 5 minute mein dost ban sakta hoon
She: Sirf pizza ke liye?
Me: Pizza + garlic bread ke liye best friend bhi ban jaunga
She: 😂😂 Next time bulaungi
Me: Screenshot le raha hoon. Yeh promise hai.
She: 🤣 Done deal`
  },
  {
    id: 58,
    title: "Dog Filter Roast",
    category: "Snapchat",
    text: `*She sends snap with dog filter*
Me: Yeh filter tumpe suit karta hai
She: Kyun? 🐶
Me: Loyal dikhti ho 😂
She: Yeh compliment hai ya insult?
Me: Depends on how you take it. Main toh dog lover hoon.
She: Toh main dog hoon?!
Me: Nahi nahi, tum dog FILTER mein ho. Bahut farak hai.
She: Explain karo
Me: Dog = loyal, cute, everyone loves them. So basically compliment hi hai.
She: Nice save 😂
Me: Main cricketer nahi hoon par catch acche pakadta hoon. Especially apni galtiyon ke.
She: 💀`
  },
  {
    id: 59,
    title: "Study Snap Exchange",
    category: "Snapchat",
    text: `*She sends snap of books*
Me: Padhai? Real padhai ya snap ke liye books khol ke rakhi hain?
She: Real padhai! Exams hain 😤
Me: Hmm, par notification toh 2 second mein read kar liya tumne
She: Woh break tha 😂
Me: Break ke 15 minute ho gaye, snap bhi bhej diya. Very productive break.
She: Tum bhi toh reply kar rahe ho, tum kya kar rahe ho?
Me: Main procrastination mein PhD kar raha hoon. Expert level.
She: Saath mein padhe? Virtual study buddy?
Me: Sure, par warning - main 10 minute padhunga, 50 minute memes bhejoonga.
She: Better than nothing 😂
Me: That's the lowest bar ever and I'm still proud.`
  },
  {
    id: 60,
    title: "Aesthetic Story Mockery",
    category: "Snapchat",
    text: `*She posts aesthetic coffee story with fairy lights*
Me: Waah, Pinterest aa gaya Snapchat pe
She: Jealous? ☕✨
Me: Haan. Mere ghar pe fairy lights nahi hain, sirf bijli ke bill hain.
She: 😂 Invest karo ambiance mein
Me: Bhai Nescafe Classic ko ambiance se match nahi kar sakta
She: Cafe chale jao
Me: 300 ka coffee? Itne mein mummy 1 hafte ka grocery le aati hain.
She: Tum bahut desi ho 😂
Me: Desi hona pride hai. Hum log 10 rupaye ki chai pe deep talks karte hain.
She: That's actually sweet
Me: Sweet? Chai mein cheeni daali thi.
She: 🤦‍♀️😂`
  },
  {
    id: 61,
    title: "Seen Zone Recovery",
    category: "Snapchat",
    text: `*She leaves me on seen*
*Next day*
Me: Main obituary likhne wala tha apni conversation ki
She: 😂😂 Sorry yaar, bhool gayi reply karna
Me: Bhool gayi? Main itna forgettable hoon?
She: Nahi yaar, busy thi
Me: Itna busy ki ek emoji bhi nahi? "👍" bhi chalti.
She: Accha sorry, ab baat karte hain
Me: Pehle terms & conditions. Reply time max 2 hours.
She: Done ✅
Me: Violation pe penalty = ek meme bhejna compulsory
She: Kaunsi court mein file karega yeh? 😂
Me: Snapchat Supreme Court. Main Chief Justice hoon.`
  },
  {
    id: 62,
    title: "Random Snap at 3 AM",
    category: "Snapchat",
    text: `*3 AM*
Me: *sends ceiling snap* "Neend nahi aa rahi"
She: Same 🥲
Me: Ceiling counting kar raha hoon. 47 tiles hain mere kamre mein.
She: Tumne count kiya?! 😂
Me: Aur kya karun? Productive insomnia.
She: Sheep count karo
Me: Sheep count ki. 234 pe sheep ne bola "bhai tu so ja"
She: 💀💀💀
Me: Tum kyun jaag rahi ho?
She: Overthinking
Me: Kya soch rahi ho?
She: Yahi ki 3 baje ceiling ke tiles kyun count ho rahe hain
Me: Tumhe meri care hai? 🥹
She: Tiles ki care hai 😂`
  },
  {
    id: 63,
    title: "Half Face Snap Game",
    category: "Snapchat",
    text: `*She sends half face snap*
Me: Baki aadha face DLC mein aayega?
She: 😂 What?
Me: Half face dikhaya, like a free trial. Full face ke liye premium subscription lena padega?
She: Haha nahi, angle accha tha
Me: Angle? Bhai trigonometry mein bhi itna angle nahi hota
She: Tum maths jokes maar rahe ho Snapchat pe?
Me: Maths joke maarne se nerdy lagta hoon na? 
She: Thoda 😂
Me: Good. Nerdy is the new sexy. Maine internet pe padha.
She: Kahan padha?
Me: Reddit. Most reliable source.
She: 🤦‍♀️ Tum hopeless ho`
  },
  {
    id: 64,
    title: "OOTD Story Reaction",
    category: "Snapchat",
    text: `*She posts OOTD mirror selfie*
Me: Dress code kya hai? Main bhi ready ho jata hoon
She: Kahi nahi ja rahi, bas OOTD hai
Me: Matlab... kapde pehen ke... ghar pe baith rahi ho?
She: Haan 😂 Photo ke liye
Me: Respect. Itni mehnat sirf photo ke liye. Dedication hai.
She: Accha laga nahi?
Me: Laga toh. But honest feedback chahiye ya Snapchat feedback?
She: Honest
Me: Color combination accha hai. 8/10.
She: Sirf 8?!
Me: 2 marks isliye kaate kyunki mirror dirty hai background mein 😂
She: OMG 💀 I hate you`
  },
  {
    id: 65,
    title: "Voice Note Awkwardness",
    category: "Snapchat",
    text: `She: *sends voice note*
Me: *listens 5 times to understand*
Me: Haan bilkul, agreed
She: Kya agreed? Maine plan cancel ki baat ki
Me: Oh... toh main kya agree kar raha tha? Teri voice note mein signal issue tha
She: Signal issue nahi hai, tumne suna nahi 😂
Me: Maine suna! But tumhari voice mein ek melody hai jo distract karti hai
She: Yeh flirting hai ya excuse?
Me: Yes ✅
She: Dono nahi ho sakte 😂
Me: Main multi-talented hoon. Flirting + excuse simultaneously.
She: Wapas sun lo voice note
Me: 6th time? Main toh tumhara biggest listener hoon. Spotify wrapped mein aaunga.`
  },
  {
    id: 66,
    title: "Group Snap Chaos",
    category: "Snapchat",
    text: `*Group snap with her friends*
She: Batao kaun kaun hai 👀
Me: Yeh toh police lineup lag rahi hai
She: 😂 Rude
Me: Arey mazak! Btw left se tisri tum ho na?
She: Nahi! Main right se pehli hoon
Me: Oh... maine galat insaan ko cute bola kal
She: KYA?! 😠
Me: MAZAK MAZAK! Obviously tum pehchaan mein aa gayi
She: Sure? Ya backtrack kar rahe ho?
Me: 100% pehchaan liya. Tumhara confidence alag dikhta hai photo mein
She: Nicee save 😏
Me: Cricket nahi khelta par diving catches expert hoon.`
  },
  {
    id: 67,
    title: "Song Recommendation Flirt",
    category: "Snapchat",
    text: `*She shares a song on story*
Me: Yeh gaana sun ke mujhe kisi ki yaad aa gayi
She: Kaun? 👀
Me: Meri ex... playlist. Bahut acchi playlist thi. Delete kar di.
She: 😂😂 Smooth
Me: But seriously, music taste accha hai tumhara
She: Thanks! Tumhara fav kaun sa gaana hai?
Me: "Tum Hi Ho"
She: Seriously? 😂
Me: Nahi, ironically. Main toh lo-fi sunta hoon pretending to be deep.
She: Sab lo-fi wale aise hi hote hain 😂
Me: Arey genuine recommend karo kuch
She: *sends a song*
Me: Done, ab yeh HUMARA gaana hai.
She: Ek gaana share kiya aur humara ho gaya? 😂`
  },
  {
    id: 68,
    title: "Travel Story Opener",
    category: "Snapchat",
    text: `*She posts Goa story*
Me: Goa mein ho? Mujhe kyun nahi bataya?
She: Tumhe kyun bataun? 😂
Me: Because... sunset photos ko koi validate toh kare
She: Friends hain mere saath
Me: Friends sunset validate karte hain? I doubt.
She: Haha toh tum kya kar rahe ho?
Me: Ghar pe. Imaginary Goa trip pe hoon. Beach = Bed. Ocean = AC ki hawa.
She: 😂😂 That's sad
Me: Sad nahi, budget-friendly hai. Zero carbon footprint.
She: Next trip pe chalna
Me: Tum bula rahi ho ya main khud invite kar loon?
She: Let's see 😏
Me: "Let's see" = Indian "no" ka polite version. Samajh gaya.
She: 😂 Nahi yaar seriously!`
  },
  {
    id: 69,
    title: "Pet Photo Reply",
    category: "Snapchat",
    text: `*She sends her cat's photo*
Me: Cute! Naam kya hai?
She: Mimi 🐱
Me: Mimi se meri baat karwao
She: 😂 Kya bologe?
Me: Bolunga ki teri owner ko meri chat ka reply karne bol
She: Main reply karti hoon! 😤
Me: 3 ghante baad? Mimi bhi faster hogi
She: Mimi toh phone use nahi karti
Me: Exactly. Woh bhi reply nahi karti. Tum bhi nahi. Same energy.
She: 😂😂 That's mean
Me: Mean nahi, comparative analysis hai. MBA useful hai kuch toh.
She: Tumne MBA kiya hai?
Me: Nahi, but ye joke MBA level tha na?
She: Nahi 😂`
  },
  {
    id: 70,
    title: "Emoji Only Conversation",
    category: "Snapchat",
    text: `Me: 👋
She: 👋😊
Me: ☕?
She: 🤔
Me: 🍕?
She: 😍👍
Me: 📅?
She: 🤷‍♀️
Me: Ok ab normal baat karein? Emoji se date fix nahi hoti 😂
She: 😂😂 Tum date fix kar rahe the?
Me: PIZZA date. Normal pizza khaane chalein.
She: "Normal pizza date" 😂 Sure
Me: Matlab haan?
She: Emoji mein boloon ya text mein? 😏
Me: Text mein bol do, emoji se miscommunication hoti hai
She: Haan chalo 🍕
Me: Was that a yes-emoji or sarcastic-emoji? Clarity chahiye.
She: 🤦‍♀️ YES. TEXT MEIN. YES.`
  },
  {
    id: 71,
    title: "Morning Snap Dilemma",
    category: "Snapchat",
    text: `*She sends morning snap, looking perfect*
Me: Tum subah uthe ho ya photoshoot se aa rahi ho?
She: 😂 Just woke up
Me: Just woke up? Mere "just woke up" mein main bhoot dikhta hoon
She: 😂😂 Itna bura nahi hoga
Me: Ek baar apna morning face bhejoon?
She: Bhejo
Me: *sends disheveled snap*
She: 😂😂😂 OMG
Me: Dekha? Yeh hai reality. Tum log filter lagate ho subah bhi
She: Maine filter nahi lagaya! 😤
Me: Toh tum naturally pretty ho? Thats unfair for the rest of us.
She: Aww 🥺
Me: Compliment le lo jaldi, roz nahi deta. Quota khatam.`
  },
  {
    id: 72,
    title: "Typing Indicator Anxiety",
    category: "Snapchat",
    text: `Me: Maine dekha tum 5 minute se type kar rahi ho
She: 😂 How do you know?
Me: "Typing..." indicator. Main stare kar raha tha.
She: That's creepy
Me: Creepy nahi, invested hoon. Kya likh rahi thi itni der?
She: Lamba message tha, phir delete kar diya
Me: DELETE?! Woh message mera tha! Mera haq tha uspe!
She: 😂😂 Kuch khaas nahi tha
Me: 5 minute type kiya aur kuch khaas nahi? Novel likh rahi thi kya?
She: Overthink mat karo
Me: Tum type karo, main overthink karun. Perfect team hain hum.
She: Hum team hain? 👀
Me: Snapchat team. Streak wali team. 😌`
  },
  {
    id: 73,
    title: "Birthday Story Reply",
    category: "Snapchat",
    text: `*Her birthday story*
Me: Happy Birthday! 🎂 Gift mein kya chahiye?
She: Thanks! Surprise me 😊
Me: Ok toh main kuch nahi de raha. Surprise! 🎉
She: 😂😂 That's not how it works
Me: Accha seriously, coffee chalein birthday treat?
She: Tum treat de rahe ho ya main? It's MY birthday 😂
Me: Birthday girl ko treat milti hai obviously. Uske baad teri baari next time.
She: Mere birthday pe plan kar rahe ho next meeting bhi? 😏
Me: Strategic planning. Long term investment.
She: Investment mein return kya milega?
Me: Good company. Meri. Which is priceless.
She: Priceless ya worthless? 😂
Me: Oof. Birthday pe roast nahi karte.`
  },
  {
    id: 74,
    title: "Rain Story Reply",
    category: "Snapchat",
    text: `*She posts rain story with "Baarish vibes ☔"*
Me: Pakode bana rahi ho?
She: Nahi 😂 Just enjoying the rain
Me: Rain enjoy karna = khidki ke paas baith ke Instagram story daalna?
She: 😂 Tum toh sab expose kar dete ho
Me: Exposure therapy hai. Tum baarish enjoy karo, main reality check dunga.
She: Tum kya kar rahe ho baarish mein?
Me: Kapde sukha ke andar le raha tha. Very romantic.
She: 😂😂 Mummy ne bheja?
Me: Mummy ka order > baarish ki romantic feelings
She: Tum bahut ghar wale lagte ho
Me: "Ghar wale" matlab gharelu? Ya "ghar wale ladke" wale?
She: Dono 😂
Me: Main isse compliment maan raha hoon.`
  },
  {
    id: 75,
    title: "Accidental Snap",
    category: "Snapchat",
    text: `Me: *accidentally sends chin snap*
She: Yeh kya tha? 😂
Me: Mera jawline reveal. Exclusive content.
She: Jawline? Bhai double chin dikhi 😂
Me: Double chin = double personality. Dono interesting hain.
She: Haha galti se gaya na?
Me: Nahi nahi, planned tha. Suspense create kar raha tha.
She: Kaunsa suspense?
Me: Pehle chin, phir neck, phir face. Trailer release hota hai na slowly?
She: Tum apne aap ko movie samajhte ho? 😂
Me: Blockbuster hoon. Bas audience kam hai.
She: Audience = main akeli?
Me: Quality > Quantity. Ek dedicated fan enough hai.
She: Fan ya victim? 😂`
  },
  {
    id: 76,
    title: "Exam Stress Bonding",
    category: "Snapchat",
    text: `She: Kal exam hai aur kuch nahi aata 😭
Me: Same. Solidarity mein main bhi nahi padh raha.
She: Tere toh exam bhi nahi hai 😂
Me: Emotional support de raha hoon. Padhai nahi.
She: Kuch useful kar, notes bhej
Me: Mere notes se toh fail ho jaogi confirmed
She: Itne bure hain?
Me: Notes nahi hain. Blank pages hain with motivational quotes.
She: 😂 Hopeless
Me: Ek kaam karo, important topics batao. Main Google karke bhejta hoon.
She: Tum Google karoge mere liye? 🥺
Me: Haan. Mere liye toh koi karta nahi, tere liye kar deta hoon.
She: Sweetest useless person ever ❤️`
  },
  {
    id: 77,
    title: "Spotify Wrapped React",
    category: "Snapchat",
    text: `*She shares Spotify Wrapped*
Me: "Top genre: Sad songs" ... sab theek hai na?
She: 😂 Sad songs acche lagte hain!
Me: Red flag nahi hai yeh? Asking for a friend.
She: Kaun friend? 👀
Me: Main hi hoon friend. No one else here.
She: 😂 Tum kya sunte ho?
Me: "Top genre: Bollywood" because desi at heart ❤️
She: That's cute actually
Me: Cute? Main aur cute? Yeh naya hai.
She: Koi nahi bolta tumhe?
Me: Mummy bolti hai. But woh biased hai.
She: 😂 Main bhi bol rahi hoon
Me: Toh tum bhi biased ho? Interesting. 👀
She: Shut up 😂`
  },
  {
    id: 78,
    title: "Netflix Recommendation",
    category: "Snapchat",
    text: `She: Kuch accha recommend karo Netflix pe
Me: Genre?
She: Kuch bhi, bore ho rahi hoon
Me: "Bore ho rahi hoon" matlab meri chat se bore ho rahi ho?
She: Nahi! 😂 Show ki baat kar rahi hoon
Me: Money Heist dekhi?
She: 2 saal pehle dekhi
Me: Breaking Bad?
She: Woh bhi
Me: Meri life ki documentary dekho. Bahut drama hai.
She: 😂 Kahan milegi?
Me: Live stream hai. Roz Snapchat pe dikhta hai.
She: Boring content hai toh cancel kar dungi 😂
Me: Arey toh saath mein dekhte hain kuch. Watch party?
She: Watch party on Snapchat? 😂 Kaise?
Me: Saamne baith ke. Revolutionary concept called "hanging out."
She: Smooth 😏`
  },
  {
    id: 79,
    title: "Mutual Friend Setup",
    category: "Snapchat",
    text: `Me: Arey tumhe Priya ne add karwaya na mujhe?
She: Haan 😂 Usne bola "interesting banda hai"
Me: Interesting? Priya ne yeh bola? Usse toh main bore lagta hoon
She: 😂 Toh kya ho tum?
Me: Depends. Tumhe kaisa chahiye? Funny? Deep? Intellectual?
She: Sab ek mein milega?
Me: 3-in-1 Nescafe jaisa. Sab milega par quality mid hogi.
She: 😂😂 Honest toh ho
Me: Honesty hi meri sabse badi quality hai. Baaki sab average hai.
She: Average se kaam chalega
Me: Toh arrange marriage mein bhi yahi bolte hain aunties 😂
She: 💀 Stop
Me: Priya ko bolna review update kare. "Interesting" se upgrade karke "funny" likhe.`
  },
  {
    id: 80,
    title: "College Event Snap",
    category: "Snapchat",
    text: `*She posts college fest story*
Me: Yeh fest hai ya fashion show?
She: 😂 Cultural fest hai
Me: Culture mein yeh outfit aata hai? Mere fest mein toh sab track pants mein the
She: Which college? 😂
Me: Woh chhodo. Tum enjoy karo. Main virtually attend kar raha hoon.
She: Chalo na! Open fest hai
Me: Bhai mujhe koi nahi jaanta wahan
She: Main jaanti hoon
Me: 1 person. Nice. Awkwardly tumhare peeche ghoomunga pura time.
She: 😂 Nahi yaar, mere friends se mila dungi
Me: "Meet my Snapchat friend" - kya introduction hoga 😂
She: Better than "meet my streak partner" 🤣`
  },
  {
    id: 81,
    title: "Photo Editing Request",
    category: "Snapchat",
    text: `She: Yeh photo acchi hai? Post karun?
Me: *zooms in* Peeche Sharma uncle khade hain towel mein
She: OMG 😂😂 Nahi dekha tha
Me: Sharma uncle ka photo toh viral hoga
She: Crop kar dungi
Me: Crop karegi toh aadhi tum bhi kat jaogi
She: Toh edit karo na please 🥺
Me: Meri fees hai
She: Kitni? 😂
Me: Ek coffee ☕
She: Done! Edit karo
Me: *edits and puts sunglasses on Sharma uncle*
She: 😂😂😂 Aise nahi!
Me: Ab Sharma uncle cool lag rahe hain. Thank me later.
She: Properly edit karo 😂
Me: Fees double. Coffee + samosa.`
  },
  {
    id: 82,
    title: "Snap Score Competition",
    category: "Snapchat",
    text: `Me: Tera snap score 5 lakh hai?! Tune life mein aur kuch kiya hai?
She: 😂 Shut up, tumhara kitna hai?
Me: 12 hazaar. Kyunki main productive insaan hoon.
She: Productive? Tum toh din bhar memes dekhte ho
Me: Memes dekhna research hai. Snap score badhaana addiction hai.
She: Toh mujhse baat karna band karo, score badh jayega 😂
Me: Nahi, tumse baat karna investment hai. Score nahi, quality badhti hai.
She: Aww 🥺 Nicest thing anyone said about my snap score
Me: Score ki baat nahi ki, tumhari baat ki
She: Wahh, poet bhi ho?
Me: Haan. "Gulaab ka phool, snap ki dhool, tere bina conversation bekaar" 🌹
She: 💀💀 Please stop`
  },
  {
    id: 83,
    title: "Skincare Routine Story",
    category: "Snapchat",
    text: `*She posts 10-step skincare routine*
Me: 10 steps? Mere liye toh Lifebuoy se kaam chal jaata hai
She: Lifebuoy?! 😂 That's soap not skincare
Me: Soap se chehra dhona skincare nahi hai?
She: NO 😭 Cleanser, toner, serum, moisturizer...
Me: Yeh sab lagane ke baad tum kab soti ho? Raat khatam ho jaati hogi
She: 20 minute lagta hai bas
Me: 20 minute! Main 20 minute mein so jaata hoon, sapna bhi dekh leta hoon
She: Isliye tumhara skin aisa hai 😂
Me: Aisa kya? Rugged? Manly?
She: Dry. 😂
Me: Dry skin, dry humor. At least consistent hoon.
She: 😂😂 Ek moisturizer recommend karungi`
  },
  {
    id: 84,
    title: "Concert Story Reply",
    category: "Snapchat",
    text: `*She posts Arijit Singh concert story*
Me: Arijit live?! Jealous level: Max
She: Amazing tha! 😍🎵
Me: "Tum Hi Ho" pe roya?
She: Nahi! 😂
Me: Jhooth. Arijit ke concert mein rona compulsory hai.
She: Ok thoda emotional hua 🥲
Me: "Thoda" = full on crying, haan samajh gaya
She: Tum hote toh?
Me: Main hota toh popcorn kha raha hota aur tujhe tissue de raha hota
She: That's actually sweet 🥺
Me: Next concert saath chalein?
She: Tickets bahut expensive hain
Me: Toh parking mein khade hokar sunenge. Awaaz toh aayegi.
She: 😂 Most desi date ever`
  },
  {
    id: 85,
    title: "Late Night Overthinking",
    category: "Snapchat",
    text: `*1 AM*
She: Soye nahi?
Me: Haan soya tha, par tere message ki notification ne jagaya
She: Sorry! 🥲
Me: Mazak hai 😂 Main bhi jaag raha hoon
She: Kya soch rahe ho?
Me: Ki agar pizza round hai, box square hai, aur slice triangle hai, toh pizza ne saare shapes cover kar liye
She: 😂😂😂 YEH sochte ho 1 baje?
Me: Haan. Deep thoughts.
She: Deep? Yeh toh geometry hai
Me: Geometry of pizza. Most important branch of mathematics.
She: Tumhare thoughts pe research paper likhna chahiye
Me: Likhenge saath mein? Co-authors. 
She: Topic: "Late night thoughts of two insomniacs" 😂`
  },
  {
    id: 86,
    title: "Meme War Challenge",
    category: "Snapchat",
    text: `Me: Meme bhejo. Best meme wins.
She: Wins kya? 🤔
Me: Winner ko loser treat deta hai
She: *sends cat meme*
Me: 6/10. Basic.
She: Basic?! 😤
Me: *sends extremely niche meme*
She: 😂😂 Yeh kahan se laate ho?
Me: Trade secret. Rate karo.
She: 9/10 😂
Me: Toh main jeeta. Coffee treat.
She: Ek meme se haar nahi manti! Best of 5.
Me: Best of 5? Tum meme war mein rules laga rahi ho?
She: Haan! Democratic meme war.
Me: Fine. Par agar main jeeta toh treat + ek compliment.
She: Deal. Agar main jeeti toh?
Me: Toh... main phir bhi treat dunga. Rigged hai yeh game. 😂`
  },
  {
    id: 87,
    title: "Auto-Reply Prank",
    category: "Snapchat",
    text: `Me: Hi! This is an automated message. I am currently unavailable. Press 1 for jokes, 2 for compliments, 3 for deep talks.
She: 😂 What? 2
Me: "You have beautiful eyes." This was an automated compliment. For personalized version, please wait for human to return.
She: 😂😂😂 Kab aayega human?
Me: Human is currently watching your story for the 3rd time. Please hold.
She: 3rd time?! 👀
Me: *system error* That information was confidential. Human will be fired.
She: 😂😂 I'm dying
Me: RIP. Should I send automated condolences?
She: Stop! 😂 Normal baat karo
Me: *Normal mode activated* Hi, how are you?
She: 😂 Boring. Automated wala better tha.
Me: Can't win with you. Literally.`
  },
  {
    id: 88,
    title: "Weekend Plan Fishing",
    category: "Snapchat",
    text: `Me: Weekend plans?
She: Kuch nahi, ghar pe
Me: Perfect. Main bhi. Dono ghar pe. Alag alag. Kitna sad hai yeh.
She: 😂 Toh kya karein?
Me: Suggestions: 1) Coffee 2) Walk 3) Museum 4) Ghar pe boring
She: Tum bahut prepared aaye ho 😂
Me: Haan, yeh message 3 din se draft mein tha
She: 3 DIN?! 😂
Me: Anxiety hai bhai. "Should I ask? Should I not?" — 72 hours of deliberation.
She: That's adorable actually
Me: Adorable = friendzone word. I'm scared now.
She: 😂 Nahi! Chalte hain coffee pe
Me: Seriously?! *pretends to be cool* Haan sure, I'm free.
She: 3 din draft kiya aur ab "I'm free" 😂`
  },
  {
    id: 89,
    title: "Filter Swap Game",
    category: "Snapchat",
    text: `Me: Let's play a game. Most embarrassing filter, go.
She: *sends baby face filter*
Me: Cute. Par embarrassing nahi hai. Cheat.
She: Ok wait *sends old age filter*
Me: HAHAHA yeh toh meri future wife dikhegi
She: WIFE?! 😳
Me: Matlab... general... kisi ki bhi... 
She: Backtrack speedrun record tod diya tumne 😂
Me: Main bolta hoon na, honesty meri weakness hai
She: Woh strength thi na? 😂
Me: Convenience ke hisaab se switch hoti hai
She: 😂😂 Ab tumhari baari, embarrassing filter
Me: *sends crying filter* Yeh meri tere message ka wait karte hue face hai
She: Aww 🥹
Me: Aww nahi, reply jaldi kara karo 😤😂`
  },
  {
    id: 90,
    title: "Food Debate Spark",
    category: "Snapchat",
    text: `Me: Hot take: Maggi > Pasta
She: WHAT?! No way 😤
Me: Maggi: 2 minute, 12 rupaye, desi. Pasta: 30 minute, 200 rupaye, pretentious.
She: Pasta is art!
Me: Maggi bhi art hai. Abstract art. Sab mixed up.
She: 😂 Tum Maggi ko art bol rahe ho?
Me: Warhol ne soup can paint kiya. Main Maggi ka NFT bana sakta hoon.
She: 😂😂 Tumse nahi jeet sakti
Me: Maggi debate mein koi nahi jeet sakta. It's the ultimate truth.
She: Accha ek baar mere haath ki pasta khaao, opinion change ho jayega
Me: "Mere haath ki" — yeh toh invitation hai. When and where?
She: Nice try 😂
Me: Pasta ke liye kuch bhi karunga. Even lose this debate.`
  },
  {
    id: 91,
    title: "Compliment Sandwich",
    category: "Snapchat",
    text: `Me: Ek game khelein? Compliment sandwich.
She: Kya hai yeh? 😂
Me: Compliment, roast, compliment. I go first.
She: Ok 😂
Me: Tumhara sense of humor amazing hai... par tumhare memes basic hain... but tumse baat karna din ka best part hai.
She: 🥺😂🥺 Meri baari?
Me: Jao
She: Tum funny ho... par tumhare puns terrible hain... but tum sabse acche late night conversation partner ho
Me: "Terrible puns"?! Those are PREMIUM puns!
She: Premium? Free mein bhi nahi chahiye 😂
Me: Ouch. That wasn't a sandwich, that was a full on roast buffet.
She: 😂 Tumne start kiya!
Me: Next round: only compliments? My ego needs recovery.`
  },
  {
    id: 92,
    title: "Crush Confession Panic",
    category: "Snapchat",
    text: `Me: Hypothetically speaking...
She: Uh oh 😂
Me: IF someone hypothetically liked talking to you a lot...
She: Haan...? 👀
Me: And hypothetically that person was on this chat...
She: Continue... 😏
Me: Would you hypothetically find that... nice?
She: Hypothetically... haan 😊
Me: Cool cool cool. Asking for a friend.
She: FRIEND?! 😂😂
Me: Haan, his name is... *checks notes* ...also me.
She: 😂😂😂 Tumhe seedha bolne mein kya problem hai?
Me: Rejection ka darr. Plus dramatic buildup better hai.
She: Rejection nahi milega 😊
Me: Yeh hypothetical answer hai ya real?
She: Real 🙈
Me: *screenshots* Evidence. Can't take it back now.`
  },
  {
    id: 93,
    title: "Cooking Disaster Share",
    category: "Snapchat",
    text: `*Sends snap of burnt roti*
Me: Masterchef audition tape ready hai
She: 😂😂 Kya bana rahe the?
Me: Roti. But abstract art ban gayi.
She: Yeh roti hai?! Charcoal dikhti hai 😂
Me: Activated charcoal roti. Detox hoga khaane se.
She: Tumhe cooking aati hai?
Me: Define "cooking." If boiling water counts, then yes, I'm a chef.
She: 😂 Main sikha dungi
Me: Private cooking class? 👀
She: Snapchat pe recipe bhejungi 😂
Me: Snapchat pe roti nahi banti. In-person demo chahiye.
She: Nice try 😏
Me: Try nahi, necessity hai. Meri roti ko dekha na? Life threatening situation hai.
She: 😂 Fine, weekend pe sikhati hoon`
  },
  {
    id: 94,
    title: "Playlist Exchange",
    category: "Snapchat",
    text: `Me: Tumhari playlist share karo. Judge karunga.
She: Judge?! 😂 No way
Me: Promise no judgment. *crosses fingers behind phone*
She: *shares playlist* "Sad Girl Hours"
Me: Playlist name hi judgment hai 😂
She: Tumhara kya hai?
Me: "Songs to pretend you're in a movie" 
She: 😂😂 THAT'S your playlist?
Me: Haan. Main road pe walk karte hue background music lagata hoon. Main character energy.
She: Main bhi karti hoon! 😂
Me: Matlab hum dono delusional hain. Perfect match.
She: Match? 👀
Me: Music match. Spotify Duo chalayenge. Sasta padega.
She: 😂 Most practical flirting ever
Me: Budget-friendly romance. Gen Z special.`
  },
  {
    id: 95,
    title: "Throwback Photo React",
    category: "Snapchat",
    text: `*She posts throwback childhood photo*
Me: Yeh kaun hai? Bahut cute!
She: Main hoon! 😂 5 saal ki thi
Me: Kya hua phir? 👀
She: MATLAB?! 😤
Me: Mazak! Ab bhi cute ho, bas thodi badi ho gayi
She: "Thodi badi" 😂 Thanks I guess
Me: Mere childhood photo dekhogi?
She: Haan!
Me: *sends photo where I'm crying*
She: 😂😂 Ro kyun rahe the?
Me: Probably future dekh liya tha. Ki ek din Snapchat pe ladkiyon se baat karunga.
She: That's dark 😂
Me: Dark humor. On brand hai mera.
She: Cute the though 🥺
Me: "The" past tense?! Ab nahi hoon?!
She: 😂 Ab bhi ho. Bas alag cute.`
  },
  {
    id: 96,
    title: "Random Would You Rather",
    category: "Snapchat",
    text: `Me: Would you rather: never use Snapchat again OR never eat pizza again?
She: That's EVIL 😂
Me: Choose.
She: ...Snapchat chhod dungi 🍕
Me: Toh phir mujhse baat kaise karogi? 😢
She: Instagram hai, WhatsApp hai
Me: Woh sab formal hai. Snapchat pe real bonding hoti hai.
She: "Real bonding" on disappearing messages? 😂
Me: Exactly! No evidence. Pure trust.
She: 😂 Deep philosophy of Snapchat
Me: My turn: WYR lose all your photos or all your contacts?
She: Photos! Contacts mein tum ho 👀
Me: ...
She: Zyada khush mat ho, 500 aur log bhi hain 😂
Me: Par pehle mera naam liya. I'll take the W.`
  },
  {
    id: 97,
    title: "Autocorrect Chaos",
    category: "Snapchat",
    text: `Me: Tumse milke accha laga
*autocorrects to*
Me: Tumse milke ACHAR laga
She: ACHAR?! 😂😂😂
Me: NAHI!! Autocorrect!! Accha laga!!!
She: Too late. Main ab achar hoon tumhare liye 😂
Me: Mango achar ya mixed?
She: 😂 Stop making it worse
Me: Arey yaar, genuine moment tha aur phone ne barbaad kar diya
She: It's ok, achar bhi accha hota hai 😂
Me: Tumse baat karke dil khush hota hai
*autocorrects to*
Me: Tumse baat karke DHAL khush hota hai
She: DHAL?! 😂😂😂
Me: I give up. Phone mere against hai.
She: Yeh conversation screenshot ho rahi hai 📸
Me: Please no 🥲`
  },
  {
    id: 98,
    title: "Dare Game Escalation",
    category: "Snapchat",
    text: `She: Truth or dare?
Me: Dare
She: Post a story saying "I love Snapchat more than food"
Me: Easy. Done. ✅ Your turn - truth or dare?
She: Truth
Me: Boring choice but ok. Last person you stalked on Snap?
She: ...pass 😂
Me: PASS?! Truth mein pass nahi hota!
She: Fine... tumhari profile 🙈
Me: MERI?! Kya dekha?
She: Snap score check kiya. Bitmoji dekha. Best friends list dekhi.
She: 😂 Thorough investigation
Me: FBI ko hire kar lo tumhe. Full surveillance.
She: Your turn. Truth.
Me: Meri best friends list mein tum top pe ho.
She: Really? 🥺
Me: Haan. Because you're the only one I snap. 😂
She: 💀 Wholesome yet sad`
  },
  {
    id: 99,
    title: "Future Plans Chat",
    category: "Snapchat",
    text: `She: 10 saal baad kya kar rahe hoge?
Me: Hopefully tujhse abhi bhi baat kar raha hounga. Par reply time better hoga.
She: 😂😂 Reply time pe obsessed ho
Me: Trauma hai. 6 ghante wait karna padta hai.
She: Accha serious answer do
Me: Serious: apna startup. Comedy + Tech. App banaunga.
She: Kaisi app?
Me: Jisme AI tumhare jokes rate kare. "Your joke was 3/10. Please try another career."
She: 😂 Yeh toh demotivation app hai
Me: Realistic motivation. Indian parents style.
She: Mujhe bhi include karo startup mein
Me: Role kya chahiye? Co-founder ya official meme curator?
She: Dono 😂
Me: Deal. Snapchat pe startup discussion. Most Gen Z thing ever.`
  },
  {
    id: 100,
    title: "Goodbye Snap Drag",
    category: "Snapchat",
    text: `Me: Chal, sona hai. Good night!
She: Good night! 😴
Me: ...
She: ...
Me: Ek aur baat
She: 😂 Bolo
Me: Kuch nahi, bas bye bolna tha properly
She: Bol diya toh jao 😂
Me: Haan ja raha hoon...
*5 minutes later*
Me: Actually ek meme bhejta hoon last
She: 😂 "Last"
Me: Haan pakka last. *sends meme*
She: 😂😂 Accha wala tha
Me: Thanks. Ok NOW good night.
She: Good night!
Me: Kal same time? 👀
She: Same time ✅
Me: Ok bye... for real this time.
She: Bye 😊
Me: ...
She: Mat bolo kuch ab 😂
Me: 😂 Ok. Bye. Final. Done. Over. Khatam. The End.`
  },
  // ===== APPROACH TEMPLATES (101-200) =====
  // Street/Park/Jogging (101-120)
  {
    id: 101,
    title: "Park Jogging Track",
    category: "Approach",
    text: `*Context: She's jogging in the park, you're barely surviving your first round*

Me: *panting heavily* Excuse me, aap kitne rounds lagate ho?
She: *removes earphone* Huh? 4-5 rounds.
Me: 4-5?! Main toh pehle round mein hi apni will likhne laga tha.
She: *laughs* Itna bhi hard nahi hai.
Me: Aapke liye nahi hoga, aap toh pro lag rahi ho. Main toh yahan sirf isliye aaya kyunki doctor ne bola "walk karo" — running kisne bola tha, woh aaj tak samajh nahi aaya.
She: Haha, doctor ne bola toh aana padega na.
Me: Actually doctor ne yeh bhi bola tha ki "motivating company dhoondho" — toh kya main aapke saath jog kar sakta hoon? Promise, main sirf peeche peeche haafunga.
She: 😂 Sure, but main rukne wali nahi hoon.
Me: Bilkul, aap bhaago, main peeche se commentary dunga — "Aur woh final lap mein hai, crowd goes wild!"
She: *laughing* You're funny.
Me: Thanks, yeh talent sirf tab aata hai jab oxygen kam hoti hai. Waise aap roz aati ho?
She: Haan mostly subah 6 baje.
Me: 6 baje?! Main toh 6 baje sirf sapne mein jogging karta hoon. Par ab reason mil gaya early morning ka.
She: 😂 Accha? Kya reason?
Me: Free coaching mil rahi hai na! Aur coach bhi itni strict hai ki ruknne nahi degi.
She: Haha deal. Kal se 6 baje. Late aaye toh penalty.
Me: Penalty kya hogi?
She: 10 extra rounds.
Me: 😱 Thik hai, alarm 5 pe lagata hoon. Waise I'm [name], apna naam toh bata do taaki kal "excuse me" na bolna pade.
She: 😊 I'm [her name]. See you tomorrow then!`
  },
  {
    id: 102,
    title: "Traffic Signal Wait",
    category: "Approach",
    text: `*Context: Both waiting at a long red signal, she's on a scooty, you're on a bike*

Me: *looks at signal* Yeh red light hai ya meditation session?
She: *smiles slightly*
Me: Seriously, itni lambi red light — main toh yahan pe ek chhota sa business start kar sakta hoon.
She: *laughs* Haan, chai ka stall laga lo.
Me: Idea toh accha hai! Aap first customer banogi? Signal green hone tak 2 cup ho jayenge.
She: 😂 Itna time toh lagta hai yahan.
Me: Roz isi time aati ho? Kyunki main bhi roz yahan phase hota hoon, socha partner in suffering mil jaaye.
She: Haha haan, office jaana padta hai na.
Me: Same! Mera office bhi uss taraf hai. Race lagayen? Loser chai pilayega.
She: Race? Scooty se bike se?
Me: Exactly, meri bike ko toh start hone mein hi 30 seconds lagte hain. Aapko head start mil jayegi.
She: 😂 That's not fair for you.
Me: Life fair kab thi? Sharma ji ka beta Harvard gaya, main yahan signal pe stand-up kar raha hoon.
She: *laughing* You're too much!
Me: Waise green hone wali hai — kal same time, same signal, same suffering?
She: Sure 😊
Me: Aur agar main late hua toh signal ka blame, deal?
She: 😂 Deal.`
  },
  {
    id: 103,
    title: "Dog Walking in Park",
    category: "Approach",
    text: `*Context: She's walking a cute dog, you're walking past*

Me: *stops* Oh wow, yeh toh celebrity lag raha hai! *pointing at dog*
She: 😂 Celebrity?
Me: Haan, itna handsome toh Bollywood mein bhi koi nahi hai. Kya naam hai inka?
She: Bruno.
Me: Bruno! Bhai Bruno, autograph dega? *extends hand to dog*
She: *laughing* Woh haath chaatega, autograph nahi dega.
Me: Chalega, Bruno ka chaatna bhi blessing hai. Waise Bruno ka Instagram hai?
She: Nahi 😂 
Me: Kya?! Iss level ki cuteness aur no Instagram? Yeh toh crime hai. Main manager ban jaata hoon Bruno ka.
She: Aur fees?
Me: Fees nahi, sirf roz Bruno se milne ka access chahiye. Aur uski owner se thodi chai.
She: 😂 Smooth.
Me: Bruno, tera vibe check pass ho gaya mera? *dog wags tail*
Me: Dekha! Bruno approved. Ab owner ka approval baaki hai.
She: 😂 Bruno ki recommendation pe chal lete hain.
Me: Perfect. Toh kal same time walk? Bruno ke liye puch raha hoon obviously.
She: Obviously 😂 Kal 6 baje.
Me: Done. Main treats leke aaunga — Bruno ke liye. Aapke liye coffee.
She: That's sweet. See you!
Me: Bruno, good boy. Tu wingman hai mera ab.`
  },
  {
    id: 104,
    title: "Waiting for Uber/Ola",
    category: "Approach",
    text: `*Context: Both standing at the same spot, clearly waiting for cabs*

Me: Aap bhi "driver 2 min mein aa raha hai" wali game khel rahi ho?
She: *laughs* Haan, 10 minute se 2 min bol raha hai.
Me: Mera toh cancel bhi ho gaya. Ab main yahan monument ban gaya hoon.
She: Same, yeh doosra driver hai mera.
Me: Ek kaam karte hain — dono same cab book karte hain, 50-50 split. Economy aur company dono.
She: 😂 Pool ka asli meaning.
Me: Exactly! Aur agar driver na aaye toh hum dono yahan se ek chhoti si protest rally nikal denge — "Uber walo, humein ghar jaana hai!"
She: *laughing* Main toh ready hoon.
Me: Waise aap kahan ja rahi ho?
She: Koramangala.
Me: Oh nice, main bhi uss taraf. Yeh toh destiny hai — cab nahi aayi taaki hum dono mil sakein.
She: 😂 Philosophy mat jhaado, cab bulao.
Me: Ek second — *books cab* — Lo 3 min. Agar yeh bhi na aaya toh main auto se lamba speech deke convince karunga.
She: Auto wala toh aur zyada drama karega.
Me: Haan par main auto walon se bargain mein gold medalist hoon.
She: 😂 Accha theek hai, mere saath share kar lo cab aayi toh.
Me: Done! Waise I'm [name], cab partner ka naam toh pata hona chahiye.
She: 😊 [Her name]. Nice meeting you in this suffering.`
  },
  {
    id: 105,
    title: "Juice Stall Morning",
    category: "Approach",
    text: `*Context: Both at a juice stall in the morning*

Me: *to juice wala bhaiya* Bhaiya, ek glass mein health, happiness aur six-pack abs daal do.
She: *laughs from next spot*
Me: *turns to her* Aap kya le rahi ho? Let me guess — something healthy like lauki juice?
She: Eww no! Orange juice.
Me: Oh thank god, lauki juice peene waalon se main darr jaata hoon. Unke andar ek alag level ka pain tolerance hai.
She: 😂 Exactly! Meri mummy peeti hai, main smell se bhaag jaati hoon.
Me: Meri mummy bhi! Aur phir bolti hai "isse pi, face glow karega." Mera face glow nahi, green ho jaata hai.
She: *laughing* Same same!
Me: Waise aap roz yahan aati ho? Kyunki juice stall buddy hona chahiye.
She: Haan mostly gym ke baad.
Me: Gym?! Main toh yahan juice peeke khud ko healthy feel karta hoon bina gym jaaye. Smart work over hard work.
She: 😂 That's cheating.
Me: Cheating nahi, efficiency. Waise kaunsa gym? Maybe I should actually join.
She: [Gym name], it's nearby.
Me: Hmm... agar wahan bhi juice stall hai toh sochta hoon.
She: 😂 Gym mein juice stall nahi hota!
Me: Toh main apna leke aaunga. Portable juice corner.
She: You're hilarious. I'm [her name].
Me: [Name] here. Kal same time, same juice? Main treat karunga.
She: Sure 😊`
  },
  {
    id: 106,
    title: "Morning Walk — Aunties' Zone",
    category: "Approach",
    text: `*Context: Morning walk area dominated by aunties, she's the only young person besides you*

Me: *walking next to her* Finally, koi apni age ka mil gaya. Main toh aunties ke beech mein lost feel kar raha tha.
She: *laughs* Same! Sab log mujhe beti bula rahe hain.
Me: Mujhe toh ek aunty ne rishta dene ki offer di — "Meri bhatiji hai, doctor hai." Main bhaag ke yahan aaya.
She: 😂 Aunties ka network Tinder se fast hai.
Me: 100%! Unka algorithm better hai — "Beta, kahin job hai? Ghar hai? Chal rishta pakka."
She: *laughing hard* Sahi mein!
Me: Waise aap bhi mummy ne bheja hai morning walk pe?
She: Haan 😅 "Subah uth, walk kar, healthy reh."
Me: Same script! "Phone rakh, bahar ja, vitamin D le." Vitamin D ka itna promotion karte hain jaise share market mein invest kara rahe ho.
She: 😂 Bilkul!
Me: Chalo at least company mil gayi. Akele walk karna toh punishment jaisa lagta hai.
She: True, with someone it's fun.
Me: Toh kal se fixed? Same time, same track, same aunty-avoidance route?
She: 😂 Done!
Me: Aur agar koi aunty rishta offer kare toh bolenge "already committed hai morning walk partner ke saath."
She: 😂😂 Perfect excuse. I'm [her name].
Me: [Name]. See you tomorrow, walk buddy!`
  },
  {
    id: 107,
    title: "Cycling Track Encounter",
    category: "Approach",
    text: `*Context: Cycling track, she overtakes you on her cycle*

Me: *pedaling hard* Excuse me! Yeh cycling track hai ya F1 circuit?
She: *slows down, laughs* Sorry, speed aa gayi.
Me: Speed? Aap toh Verstappen lag rahi thi! Main yahan apni nani ki speed se chal raha hoon.
She: 😂 Practice karo, ho jayega.
Me: Practice?! Main toh pehle 500 meter mein hi surrender flag lagane wala tha.
She: Kab se cycling kar rahe ho?
Me: Aaj pehla din hai. Meri body abhi protest rally nikal rahi hai.
She: *laughing* Pehle din mein itna enough hai. Dheere dheere badhao.
Me: Aap coach ban jaogi toh motivation bhi rahega. Akele main Netflix dekhne chala jaunga.
She: 😂 Coaching fees lagegi.
Me: Fees? Chai chalegi? Saamne wali tapri ki chai worth it hai trust me.
She: Hmm chai toh chalegi.
Me: Done! Ek round aur maarte hain, phir chai break. Main peeche peeche aaunga, aap slow chalana please.
She: Okay deal 😊
Me: Waise I'm [name], coach ka naam toh pata hona chahiye student ko.
She: [Her name]. Ab chalo, bahut rest ho gaya!`
  },
  {
    id: 108,
    title: "Garden Selfie Spot",
    category: "Approach",
    text: `*Context: She's trying to take a selfie at a garden but struggling with the angle*

Me: 5 attempts ho gaye, kya main help kar doon? Main accha photographer hoon — atleast meri mummy toh bolti hai.
She: *laughs* Haan please, angle nahi aa raha.
Me: *takes phone* Okay, thoda left... aur thoda smile — nahi nahi, natural smile, passport photo wali nahi.
She: 😂 *laughs naturally*
Me: *clicks* Perfect! See? Yeh wala toh Instagram story material hai.
She: *sees photo* Oh wow, actually accha aaya!
Me: Told you. Meri fees hai ek follow aur ek coffee ☕
She: 😂 Pehle se decide karke aaye ho kya?
Me: Nahi nahi, yeh on-the-spot quotation hai. GST extra.
She: *laughing* GST bhi?!
Me: Haan, "Good Selfie Tax." Naya rule hai garden mein.
She: You're too much 😂
Me: Waise aur photos chahiye? Main is garden ka har angle jaanta hoon. Full photoshoot ho jayega.
She: Actually haan, woh fountain ke paas leni hai ek.
Me: Chaliye madam, aapka personal photographer ready hai. Tip optional hai par appreciated.
She: 😂 Chal.
Me: *after clicking more* Yeh sab bhejne ke liye number toh chahiye...
She: 😏 Smart. [Gives number]
Me: Professional photographer always delivers. WhatsApp pe bhej dunga.`
  },
  {
    id: 109,
    title: "Park Bench Reader",
    category: "Approach",
    text: `*Context: She's reading a book on a park bench*

Me: *sits nearby, glances* Excuse me, woh book acchi hai kya? Cover se toh interesting lag rahi hai.
She: *looks up* Haan, it's really good actually. [Book name].
Me: Oh nice! Main bhi padhne ka sochta hoon... par phir Instagram khul jaata hai.
She: 😂 Relatable.
Me: Seriously, mera Goodreads "want to read" list mein 200 books hain. "Read" mein 3.
She: *laughing* Same energy.
Me: Aap toh dedicated reader lag rahi ho. Park mein book — yeh toh movie scene hai.
She: 😂 Bas peaceful lagta hai yahan.
Me: Sahi hai. Main toh park mein sirf bench pe baithke existential crisis karta hoon. Aap toh productive ho.
She: Haha, reading is my escape.
Me: Mera escape toh yeh hai — random logon se baat karna jo books padh rahe hain.
She: 😂 Effective escape hai.
Me: Waise koi recommendation? Agar aap bol rahi ho toh pakka padhke aauga — phir discuss karenge.
She: Hmm... try [book name]. Bahut acchi hai.
Me: Done! Par condition — jab main padh lu, toh review session hoga yahan same bench pe?
She: 😂 Sure, book club of two.
Me: Best club ever. I'm [name], co-founder of this bench book club.
She: [Her name]. Happy reading!
Me: Ek week do, main padhke aaunga. Tab tak bench reserve rakhna!`
  },
  {
    id: 110,
    title: "Street Food Stall — Golgappe",
    category: "Approach",
    text: `*Context: Both at a golgappe stall*

Me: *to bhaiya* Bhaiya teekha wala. *turns to her* Aap?
She: Sweet wala.
Me: Sweet golgappe?! Yeh toh crime against humanity hai!
She: 😂 Sweet best hai!
Me: Nahi nahi, teekha golgappe khao — life ke struggles face karne ki training ho jaati hai.
She: Teekha khaake toh meri aankh se paani aa jaata hai.
Me: Exactly! Free emotional release. Therapist ki zaroorat nahi.
She: 😂😂
Me: Ek kaam karo — ek mera teekha try karo, ek main tumhara sweet. Fair trade.
She: Hmm okay deal.
Me: *gives one* Lo, brave bano.
She: *eats* OH GOD 🔥 *coughing*
Me: *eating her sweet one* Yeh toh meethi aunty ke ghar ka khana lag raha hai.
She: 😂😂 *still coughing* How do you eat this?!
Me: Practice. Roz ek plate — ab toh mirchi bhi mujhse darr jaati hai.
She: You're crazy!
Me: Crazy nahi, spice connoisseur. Waise aur plate?
She: Haan but sweet!
Me: Okay compromise — medium spice? Diplomatic golgappe?
She: 😂 Okay fine, medium.
Me: Dekha? Already compromise ho raha hai. Yeh toh relationship ki nishani hai.
She: 😂😂 Shut up! *laughing*
Me: I'm [name], golgappe debate champion.
She: [Her name]. Rematch next week?
Me: Same stall, same fight, done!`
  },
  {
    id: 111,
    title: "Bus Stop Wait",
    category: "Approach",
    text: `*Context: Waiting at a bus stop, bus is late as usual*

Me: Aapko bhi lagta hai ki yeh bus aaj aayegi ya kal?
She: *laughs* 20 minute se wait kar rahi hoon.
Me: Main toh 30 minute se hoon. Mujhe toh lagta hai bus wala bhi apna Tinder check kar raha hoga kahin pe.
She: 😂 Ho sakta hai.
Me: Waise yeh bus stop pe itna wait karna — yeh toh government-sponsored patience training hai.
She: Bilkul! Free mein sikhate hain.
Me: Aur resume mein likh sakte hain — "Can wait for anything. Trained by DTC buses."
She: 😂😂 Yeh toh add karna chahiye.
Me: Interview mein poochenge "What's your greatest strength?" — "Sir, main DTC bus ka wait karta hoon. Mujhse zyada patient koi nahi."
She: *laughing hard*
Me: Chalo since bus nahi aa rahi, introduction toh ho jaaye. I'm [name].
She: [Her name].
Me: Nice. Ab kam se kam akela boring wait toh nahi lagega.
She: True, company acchi hai.
Me: Roz same time? Same bus? Same suffering but together?
She: 😂 Roz same time.
Me: Aur agar bus aa gayi toh — same seat ke paas baithenge, deal?
She: Deal 😊`
  },
  {
    id: 112,
    title: "Metro Station Platform",
    category: "Approach",
    text: `*Context: Crowded metro platform, both looking at the indicator board*

Me: "Next train in 4 minutes" — yeh 4 minute hain ya 4 saal?
She: *smiles* Metro time alag chalta hai.
Me: Haan, Einstein ne relativity yahan pe discover ki thi actually.
She: 😂 Lag toh raha hai.
Me: Aap bhi daily commuter ho? Kyunki yeh exhausted-but-still-going expression sirf regulars ka hota hai.
She: *laughs* Haan, roz ki kahani.
Me: Same. Mera toh metro mein hi sab hota hai — breakfast, nap, existential crisis, sab.
She: Main toh metro mein podcast sunti hoon.
Me: Oh nice! Kaunsa podcast? Main toh sirf uncles ki conversations sun-ta hoon — "Aaj toh market girega."
She: 😂 Haan uncles ka analysis toh free hai.
Me: Best financial advisors hain metro uncles. Unki tips follow karo toh guaranteed loss.
She: *laughing* So true.
Me: Chalo metro aa rahi hai — standing mein competition kaun jeetega, bet lagayen?
She: 😂 Kaise competition?
Me: Jo pehle seat dhundh le uski jeet. Loser ko next station ki coffee.
She: Done! Main fast hoon.
Me: Dekhte hain!
*both rush in, she finds seat*
She: HAH! Coffee de do!
Me: Fair hai, next station pe. I'm [name], aur main haarne mein expert hoon.
She: 😂 [Her name]. Coffee yaad rakhna!`
  },
  {
    id: 113,
    title: "Parking Lot Confusion",
    category: "Approach",
    text: `*Context: Both looking for their cars/bikes in a confusing parking lot*

Me: Excuse me, aapne bhi apni gaadi kho di hai ya sirf main hoon?
She: *laughs* Haan, 5 minute se dhoondh rahi hoon!
Me: Thank god, mujhe laga mujhe Alzheimer's ho gaya 22 saal ki umar mein.
She: 😂 Yeh parking lot maze jaisa hai.
Me: Haan, level 3, zone B, row 7 — yeh parking hai ya escape room?
She: Exactly! Koi map dena chahiye entry pe.
Me: Aur GPS — "Apni gaadi tak navigate kar rahe hain, left lein, phir seedha, phir pray karein."
She: 😂😂
Me: Chalo saath mein dhoondhte hain — meri help karo, main tumhari. Team work.
She: Okay sure, meri silver Swift hai.
Me: Meri blue bike. Pehle jo dhoondh le woh winner.
She: Har cheez mein competition?
Me: Life boring hai bina competition ke!
She: 😂 True. Chalo start.
*5 minutes later, find both*
Me: YES! Meri bike pehle mili! Main jeetaaaa!
She: Sirf isliye kyunki bike chhoti hai aur dikhti hai!
Me: Excuses! Haarna seekho gracefully.
She: 😂 Next time mall ke parking mein rematch.
Me: Done. I'm [name].
She: [Her name]. Bye parking buddy!`
  },
  {
    id: 114,
    title: "ATM Queue",
    category: "Approach",
    text: `*Context: Long ATM queue, both frustrated*

Me: *sighs* Yeh ATM queue hai ya Tirupati darshan ki line?
She: *laughs* Seriously! 15 minute ho gaye.
Me: Andar wala banda pura bank loan le raha hai kya ATM se?
She: 😂 Lagta toh aisa hi hai.
Me: Main toh soch raha hoon yahan pe ek chhota café khol doon — "ATM Queue Café — wait karo, sip karo."
She: Bahut customers aayenge 😂
Me: Shark Tank pe pitch karunga — "Sir, ATM queues kabhi khatam nahi hongi, aur na mera business."
She: 😂😂 Aman Gupta: "Yeh toh lakhon ka idea hai!"
Me: Exactly! Aap co-founder banogi? 50-50?
She: 50-50? ATM se kitna nikal rahi hoon pehle woh toh dekh loon 😂
Me: Fair point. Waise aap UPI kyun nahi use karti?
She: Cash chahiye tha, doodh wala UPI nahi leta.
Me: Doodh wala UPI nahi leta?! 2025 mein?! Usse toh pehle digitize karna chahiye.
She: 😂 Aap jaake bolo usse.
Me: Main bolunga, par pehle yeh line toh aage badhe.
She: Haan, next hamara number hai finally.
Me: Thank god. Main [name], ATM survivor.
She: [Her name], fellow survivor 😊`
  },
  {
    id: 115,
    title: "Street Market Shopping",
    category: "Approach",
    text: `*Context: Both browsing same stall at a street market*

Me: *picking up same item she's looking at* Oh sorry! Aap pehle dekh rahi thi.
She: No no, it's fine, aap dekho.
Me: Nahi nahi, aap dekho. Main gentleman hoon... jab tak bargaining shuru na ho.
She: 😂 Bargaining mein gentleman nahi chalte?
Me: Bargaining mein toh main warrior hoon. 500 ka cheez 150 mein leke jaata hoon.
She: Wow, pro ho!
Me: Pro? Black belt hoon. Yeh stall wale mujhe dekhte hain toh darr jaate hain.
She: 😂 Teach me then!
Me: Lesson 1: Pehle cheez dekho, phir mooh banao jaise bahut ganda hai, phir bolo "bhaiya yeh toh bahut mehenga hai."
She: Aur kaam karta hai?
Me: 90% success rate. Baaqi 10% mein bhaiya gussa ho jaata hai toh dusre stall pe jaao.
She: 😂😂 Expert!
Me: Chalo, practice karte hain. Woh stall pe chalte hain, main demonstrate karta hoon.
She: Okay let's go!
*after bargaining*
Me: Dekha? 400 ka 200 mein! *proud face*
She: 😂 Impressive! Mera bhi karao na.
Me: Abhi se? Fees lagegi — ek chai aur apna number.
She: 😂 Smooth operator. Fine, chai toh deserve karte ho.
Me: I'm [name], bargain coach.
She: [Her name]. Best shopping experience ever!`
  },
  {
    id: 116,
    title: "Roadside Chai Stall",
    category: "Approach",
    text: `*Context: Both at a roadside chai stall*

Me: *sipping chai* Bhaiya ki chai peeke toh lagta hai sab kuch theek ho jayega.
She: *smiles* Best chai hai yahan ki.
Me: Aap bhi regular ho? Matlab humne kitne din waste kiye alag alag time pe aake?
She: 😂 Haan roz aati hoon 5 baje.
Me: 5 baje?! Main bhi around that time! How did we never meet? Yeh toh cosmic delay tha.
She: Haha maybe.
Me: Waise cutting ya full?
She: Cutting.
Me: Ah, a woman of culture! Cutting chai > everything.
She: Obviously! Full chai toh tourist peete hain.
Me: 😂 Exactly! Cutting mein concentration hota hai chai ka — pure, undiluted happiness.
She: Poetic ho chai ke baare mein.
Me: Chai mere liye religion hai. Main toh sochta hoon resume mein hobby section mein likhu — "Chai tasting and philosophical discussions at tapris."
She: 😂 Interviewer confused ho jayega.
Me: Par impressed bhi! "This man has priorities."
She: *laughing* True.
Me: Kal chai pe bet? Main ek nayi tapri dhundh ke lata hoon — taste test karenge.
She: Oh like a chai crawl?
Me: Exactly! "Delhi Chai Crawl" — 5 tapris, 5 cups, 1 winner.
She: I'm in! 😊
Me: Done! I'm [name], Chief Chai Officer.
She: [Her name], ready for the crawl!`
  },
  {
    id: 117,
    title: "Evening Walk with Earphones",
    category: "Approach",
    text: `*Context: She's on her evening walk with earphones, humming a song*

Me: *walking alongside* Woh gaana jo aap guna rahi ho — Arijit Singh?
She: *surprised, removes earphone* Oh! Haan, how did you know?
Me: Kyunki evening walk pe sirf do cheezein chalti hain — Arijit Singh ya existential crisis playlist.
She: 😂 Accurate.
Me: Main toh dono saath mein sun-ta hoon. Multitasking.
She: Haha sad boy vibes?
Me: Full time. Mera Spotify Wrapped toh therapist ko forward karna chahiye.
She: 😂😂 Same actually.
Me: "Your top genre was Sad Hindi — you listened to 47 hours of heartbreak. Are you okay?"
She: *laughing* Spotify be judging us.
Me: Seriously! Aur phir recommend karta hai "Happy Bollywood" — bro, meri life mein itna plot twist nahi hai.
She: 😂 You're hilarious.
Me: Thanks, yeh talent loneliness se aata hai. Waise kya sun rahi ho abhi exactly?
She: [Song name].
Me: Oh nice! Main bhi sunta hoon. Chalo playlist exchange karte hain?
She: Sure! You have good taste?
Me: Mera taste toh questionable hai life mein but music mein solid hai.
She: 😂 Fair enough. Share karo.
Me: Spotify ya Apple Music?
She: Spotify.
Me: Same! ID do, follow karta hoon. Collaborative playlist bhi bana sakte hain — "Evening Walk Vibes."
She: Cute idea! [Shares ID]
Me: Done! Kal walk pe new playlist test karenge.`
  },
  {
    id: 118,
    title: "Skateboard Park Newbie",
    category: "Approach",
    text: `*Context: She's skateboarding, you're watching from the side*

Me: *clapping* Woh trick toh Olympic level tha!
She: *laughs* Sirf balance rakh paayi, trick kahan!
Me: Balance rakhna bhi trick hai! Main toh skateboard pe khade hote hi girr jaata hoon.
She: Seriously? Try karo na!
Me: Last time try kiya tha — 3 seconds khada raha, phir dharti maata ne gale lagaya.
She: 😂 Everyone falls initially.
Me: Mera "initially" 6 months chal raha hai.
She: 😂😂 Thoda aur practice chahiye bas.
Me: Yaa... ek acchi teacher chahiye. *looks at her*
She: Oh subtle 😂
Me: Subtle? Main toh billboard lagane wala tha — "Skateboard teacher wanted. Payment: chai + compliments."
She: 😂 Chai toh milni chahiye.
Me: Bhaiya! Do chai! *calls chai wala*
She: Wait abhi class toh shuru nahi hui!
Me: Pre-class chai. Motivation ke liye zaroori hai.
She: *laughing* Okay fine, after chai lesson 1.
Me: Deal. Main ready hoon girne ke liye — physically aur emotionally.
She: 😂 You're fun. I'm [her name].
Me: [Name]. Aaj se aap meri guru ho. Guru dakshina mein chai milegi roz.`
  },
  {
    id: 119,
    title: "Lake Side / Ghat Walk",
    category: "Approach",
    text: `*Context: Both sitting at a lake/ghat watching sunset*

Me: Yeh sunset dekhke aapko bhi lagta hai ki life mein sab theek ho jayega, ya sirf mujhe?
She: *laughs softly* Haan, peaceful hai.
Me: Main toh yahan roz aata hoon — free therapy session. Isse accha toh koi psychologist nahi.
She: True, nature is the best healer.
Me: Aur sasta bhi! Therapy ke 2000 per session, yahan free mein sunset mil raha hai.
She: 😂 Budget therapy.
Me: Exactly! "Dr. Sunset — no appointment needed, side effects include peace and Instagram stories."
She: 😂😂 Clinic khol do.
Me: Aap receptionist banogi? "Please wait, Dr. Sunset will see you at 6:30 PM sharp."
She: 😂 Patients ko kya bolenge?
Me: "Ek plate moongfali khao aur chup-chaap sunset dekho. Yeh hai aapki medicine."
She: *laughing* Best prescription ever.
Me: Waise I'm [name], regular patient of Dr. Sunset.
She: [Her name], new patient.
Me: Welcome! First session free hai. Second ke liye chai laani padegi.
She: 😂 Fair deal. Kal?
Me: Kal same time. Main moongfali lata hoon.
She: Done 😊`
  },
  {
    id: 120,
    title: "Flower Market",
    category: "Approach",
    text: `*Context: Both at a flower market, she's selecting flowers*

Me: *picking up roses* Bhaiya, yeh phool kitne fresh hain? Kal ke toh nahi?
Bhaiya: Sahab, aaj subah ke hain!
Me: *to her* Aap kya le rahi ho? Pooja ke liye?
She: Haan, ghar pe pooja hai.
Me: Same! Mummy ne bheja hai — "Genda phool leke aa, aur marigold bhi." Maine bola "Mummy woh same hai." Bolti hai "Tu bas le aaja."
She: 😂 Mummy se argue mat karo, always wrong hote ho.
Me: Yeh universal truth hai! Mummy ke against argument ka success rate 0.001% hai.
She: Exactly! Main toh try bhi nahi karti ab.
Me: Smart. Main abhi bhi try karta hoon — daily L leta hoon.
She: 😂 Seekho mere se.
Me: Seekh raha hoon! Waise yeh mogra accha lag raha hai, pooja ke liye logi?
She: Haan, mogra toh chahiye.
Me: *picks the best bunch* Yeh lo, maine smell karke check kiya — 10/10.
She: Thank you! Accha taste hai.
Me: Phoolon mein taste hai mera, baaki life mein debatable hai.
She: 😂
Me: Waise I'm [name], mummy ke flower delivery boy.
She: [Her name], same job profile 😂
Me: Kal phir aana hai, mummy ke orders kabhi khatam nahi hote. Same time milte hain?
She: Sure 😊`
  },
  // Mandir/Religious (121-135)
  {
    id: 121,
    title: "Mandir — Family Photo Chaos",
    category: "Approach",
    text: `*Context: She's trying to click a family photo at a mandir, everyone's not cooperating*

Me: *watching the chaos* Aunty ko bolo thoda left, uncle ka haath hata do, aur chhote ko chocolate ka lalach do — perfect photo aa jayegi.
She: *laughs* You've been watching?
Me: 5 minute se dekh raha hoon, yeh mere family jaisa hi scene hai. Professional experience hai mujhe.
She: 😂 Help karo na please!
Me: Sure! *takes charge* Uncle ji, thoda smile dijiye — nahi, natural wali, passport wali nahi. Aunty ji, perfect hai. Chhotu, yahan dekh — *makes funny face* 
*clicks multiple photos*
She: *checks* Oh wow, actually acche aaye!
Her Mom: Beta, bahut acche photos liye! Kya karte ho?
Me: Aunty ji, main toh bas yahan darshan karne aaya tha, par talent ko rok nahi paaya.
Her Mom: 😂 Bahut funny hai yeh ladka!
Me: Aunty ji, aapke saath bhi ek photo? Family ka official photographer bana diya toh service free rahegi.
Her Dad: *laughing* Haan haan, le lo photo!
Me: *takes family photos, then whispers to her* Dekha? Parents approved pehle, ab toh baat karni padegi.
She: 😂😂 You're something else.
Me: Photos bhejne ke liye number chahiye... family ke liye puch raha hoon obviously.
She: Obviously 😂 [gives number]
Her Mom: Beta, naam kya hai tumhara?
Me: [Name], aunty ji. Aur next pooja pe bulana, main photographer ready rahunga!`
  },
  {
    id: 122,
    title: "Mandir — Prasad Line",
    category: "Approach",
    text: `*Context: Both in the prasad distribution line at a mandir*

Me: *whispering* Pehle se pata hota laddu milega ya pedha, toh anticipation toh kam hoti.
She: *giggles* Haan, suspense hi toh hai.
Me: Yeh prasad line hai ya Kaun Banega Crorepati — "Aapka prasad hai... *dramatic pause* ...LADDU!"
She: 😂 Audience poll use karna chahiye.
Me: "50-50 karo Amitabh ji — laddu ya pedha?"
She: 😂😂 Stop!
Me: Waise aap regularly aati ho yahan?
She: Haan, har Tuesday.
Me: Oh Tuesday! Hanuman ji ka din. Main bhi aata hoon mostly.
She: Accha? Kabhi dikhe nahi.
Me: Kyunki main late aata hoon. Subah uthna aur devotion — dono ek saath mushkil hai.
She: 😂 Relate karta hoon.
Me: Aaj toh jaldi aa gaya — aur result bhi accha hai, interesting company mil gayi.
She: 😂 Smooth.
Me: Bhagwan ji ne sun li meri. Maine bola tha "Kuch accha karo aaj" — unhone deliver kiya.
She: 😂😂 Bhagwan ko credit de rahe ho?
Me: Full credit! Unka setup hai, main toh sirf dialogue bol raha hoon.
She: You're hilarious. I'm [her name].
Me: [Name]. Next Tuesday same time?
She: Same time ✨`
  },
  {
    id: 123,
    title: "Mandir — Aarti Time",
    category: "Approach",
    text: `*Context: During aarti, both standing in the crowd, bell ringing loudly*

Me: *after aarti, rubbing ears* Woh bell itni loud thi ki mujhe laga Bhagwan ji khud bol rahe hain "SUNAI DE RAHA HAI?!"
She: 😂 Haan, kaan band karne pade.
Me: Main toh soch raha tha ki aarti ke baad hearing test free mein ho jaaye toh accha hai.
She: 😂 ENT doctor bhi bahar stall lagaye toh kaafi customers milenge.
Me: 😂 Business idea! Mandir ke bahar ENT clinic — "Aarti ke baad check-up, darshan ke baad diagnosis."
She: *laughing hard* You're terrible!
Me: Terrible nahi, practical! Waise aapko aarti ka woh specific moment pasand hai jab sab log ek saath haath hilate hain aur koi rhythm nahi hota?
She: 😂 Haan! Random hi hota hai.
Me: Main toh choreographer hire karna chahta hoon mandir ke liye. Synchronized aarti — flash mob style.
She: 😂😂 Pandit ji allow nahi karenge.
Me: Pandit ji ko lead dancer bana denge, they'll love it!
She: Pagal ho tum!
Me: Thank you, yeh compliment hai mere liye 😂 I'm [name].
She: [Her name]. Tumse milke aarti aur entertaining ho gayi!
Me: Next time saath mein khade hone ka — bell ki complaints ek doosre se karenge.
She: 😂 Done!`
  },
  {
    id: 124,
    title: "Navratri Garba Night",
    category: "Approach",
    text: `*Context: Garba night, you have zero garba skills*

Me: *doing random steps badly near her*
She: *notices, laughs* Woh garba nahi hai, woh toh cardio lag raha hai.
Me: Cardio bhi nahi hai, yeh toh survival hai. Main toh steps dekh ke follow kar raha hoon par brain sync nahi ho raha.
She: 😂 Want me to teach you?
Me: Please! Meri reputation iss dandiya se zyada tooti hui hai.
She: *laughing, shows basic steps* Dekho — ek do teen, ek do teen.
Me: Ek do teen... *trips* ...char paanch bhi ho gaye.
She: 😂😂 Dheere karo.
Me: Main Hrithik ban-na chahta tha, Govinda ban gaya.
She: Govinda bhi accha dancer hai!
Me: Accha hai par uski wali style mein toh aur log gir jayenge.
She: 😂 Okay phir se try karo. Mere saath.
Me: *tries again, slightly better* Hey! Kuch kuch ho raha hai!
She: 😂 "Kuch Kuch Hota Hai" ka reference garba mein? Nice.
Me: Unplanned tha par accha fit ho gaya. Waise aap pro ho — kitne saal se kar rahi ho?
She: Bachpan se! Gujarati hoon.
Me: Oh toh toh genes mein hai! Mujhe toh acquired skill banana padega.
She: Private classes de dungi 😂
Me: Fees?
She: Garba ke baad chai.
Me: DONE. Best deal ever. I'm [name], garba ka zero to hero.
She: [Her name]. Class starts now, focus!`
  },
  {
    id: 125,
    title: "Temple Stairs Climb",
    category: "Approach",
    text: `*Context: Long temple staircase, both climbing, both tired*

Me: *panting on step 150* Excuse me, yeh mandir hai ya Everest Base Camp?
She: *also tired, laughs* Seriously! Kitne aur hain?
Me: Maine Google kiya tha — 300 steps. Hum abhi half-way pe hain. Congratulations, aur half baaki.
She: 😭 Khatam nahi hoga yeh.
Me: Bhagwan ji ne test rakha hai — "Kitna chahte ho darshan?" Answer: Bahut chahte hain, par knees bhi chahte hain.
She: 😂 Knees ne toh strike de di hai.
Me: Same! Meri legs keh rahi hain "Bhagwan online bhi milte hain, Zoom call kar le."
She: 😂😂 Digital darshan!
Me: Ek kaam karte hain — har 50 steps pe break lenge. Deal?
She: Deal! Thank god, companion mil gaya.
Me: Haan akele chadh-na toh punishment hai. Ab kam se kam dukh share ho jayega.
She: *laughing* Dukh sharing partner.
Me: Best kind of partner! Chalo, next 50 mein koi ek interesting fact bolega — time pass bhi ho jayega.
She: Okay! Did you know this temple is 800 years old?
Me: 800 saal! Tab toh lifts nahi thi... excuse valid hai unka. Ab kya excuse hai?!
She: 😂 Budget nahi hai shayad.
Me: GST laga do steps pe — "Step tax: Rs 1 per step. Lift chahiye toh Rs 500."
She: You're crazy. I'm [her name].
Me: [Name]. Chalo partner, 150 aur!`
  },
  {
    id: 126,
    title: "Mandir — Pooja Thali Drop",
    category: "Approach",
    text: `*Context: She accidentally drops her pooja thali items*

Me: *quickly helps pick up* Yeh lo, sab kuch mil gaya — phool, agarbatti, aur... yeh sindoor hai ya kumkum?
She: Oh thank you so much! Kumkum hai.
Me: Phew! Safe hai sab. Bhagwan ji samajhte hain, unke ghar mein accidents allowed hain.
She: 😂 I hope so, bohot embarrassing tha.
Me: Embarrassing? Nahi nahi, yeh toh Bhagwan ji ka sign hai — "Beta, dhyan se chal, life mein bhi aur mandir mein bhi."
She: *laughing* Deep meaning nikal liya.
Me: Main har situation mein philosophy dhundh leta hoon. Talent hai.
She: Philosopher ya comedian?
Me: Dono ka mixture. Philoso-comedian. New genre hai, patent pending.
She: 😂 First of its kind.
Me: Waise aap akeli aayi ho ya family?
She: Family hai, woh andar hain.
Me: Nice! Main bhi akela — mummy ne list di hai: "Pooja kar, prasad la, aur haan — ache se maatha tek."
She: 😂 Mummy ki orders.
Me: Haan, Zomato jaisi tracking bhi karti hain — "Pahunch gaya? Photo bhej."
She: 😂😂 Same!
Me: Chalo saath mein chalte hain andar? Pooja thali guard karunga iss baar.
She: 😂 Bodyguard for thali. Sure!
Me: I'm [name], professional thali protector.
She: [Her name]. Thank you thali-guard!`
  },
  {
    id: 127,
    title: "Darshan Queue — Hours Long",
    category: "Approach",
    text: `*Context: Both stuck in an extremely long darshan queue*

Me: Aapko pata hai iss queue mein itna time lagta hai ki mere baad wale bande ne toh tent laga liya hai.
She: 😂 Main toh tiffin laayi hoon.
Me: Tiffin?! Pro player ho tum toh. Main toh khaali haath aaya — rookie mistake.
She: Pehli baar aaye ho?
Me: Is particular queue mein haan. Pehle choti line wale mandirs mein jaata tha — express darshan.
She: 😂 Express darshan! Drive-through mandir chahiye.
Me: Billion dollar idea! "McMandir — Darshan in 2 minutes or prasad free."
She: 😂😂 Shark Tank pe jaao!
Me: Ashneer bolega "Yeh sab doglapan hai, bhagwan toh free mein milte hain!"
She: *laughing hard* PERFECT impression.
Me: Waise tiffin mein kya hai? Main hungry ho raha hoon aur mandir ka line mujhe emotional bana rahi hai.
She: Paratha hai. Ek khaoge?
Me: Seriously?! You're an angel in a darshan queue.
She: 😂 *gives paratha*
Me: *eating* Yeh toh mummy ke haath jaisa hai! Kaun banaata hai?
She: Maine banaya.
Me: ... Main toh pehle se impress tha, ab toh aur ho gaya. I'm [name].
She: [Her name] 😊 Queue toh lambi hai, time pass ho jayega!`
  },
  {
    id: 128,
    title: "Mandir ka Langar/Bhandara",
    category: "Approach",
    text: `*Context: Sitting together at a mandir langar/bhandara*

Me: Yeh mandir ka khana kyun ghar se zyada tasty hota hai? Secret ingredient kya hai?
She: 😂 Devotion?
Me: Devotion! Haan matlab mummy bhi devotion se banaye toh ghar ka khana bhi hit ho jayega.
She: 😂 Mummy ko mat bolna yeh.
Me: Nahi nahi, mummy ko toh bolunga "Best hai!" — survival instinct hai.
She: Smart boy.
Me: Waise aap roz aati ho langar mein?
She: Nahi, special occasion hai aaj.
Me: Oh, kya occasion?
She: Birthday hai mera 🎂
Me: BIRTHDAY?! Aur aap mandir mein?! Yeh toh most wholesome birthday celebration hai. Happy Birthday!
She: Thank you! 😊
Me: Main toh birthday pe pizza order karta hoon — aap yahan Bhagwan se blessings le rahi ho. Levels different hain.
She: 😂 Pizza bhi khaaungi baad mein.
Me: Toh phir cake cutting kab hai? Main toh invited hoon na? Langar saath khaya hai — basically family hain hum ab.
She: 😂😂 Family? 10 minute pehle mile hain!
Me: Langar ki speed alag hoti hai — bonding fast hota hai yahan.
She: 😂 You're crazy. Fine, evening mein friends ke saath celebration hai.
Me: Location bhejo, main cake leke aaunga! I'm [name].
She: 😂 [Her name]. Dekhte hain!`
  },
  {
    id: 129,
    title: "Diwali Pooja at Society Temple",
    category: "Approach",
    text: `*Context: Society Diwali pooja, both from same apartment complex*

Me: Aap bhi iss society mein rehti ho? Maine toh kabhi dekha nahi.
She: Haan, 3rd floor, B wing.
Me: B wing! Main A wing, 4th floor. Practically neighbors hain hum — just didn't know.
She: 😂 Society mein toh koi kisiko nahi jaanta.
Me: Exactly! Lift mein milte hain, awkward smile dete hain, aur seedha ghar.
She: 100% accurate 😂
Me: Aaj toh Diwali pooja hai toh at least introduction ho gayi. Warna aise hi retirement tak strangers rehte.
She: Haha true. I'm [her name].
Me: [Name]. Nice! Ab toh lift mein naam se bula sakta hoon instead of "uh... hi."
She: 😂 Big upgrade.
Me: Waise aapki Diwali prep kaisi chal rahi hai? Mummy ne mujhe 47 items ki list di hai — "Yeh la, woh la, safai kar."
She: Same! Mummy ka Diwali matlab deep cleaning drive.
Me: Deep cleaning plus decoration plus sweet distribution plus relatives ko jhel-na — Olympic event hona chahiye yeh.
She: 😂 Gold medal milni chahiye.
Me: Chalo iss Diwali ek deal karte hain — agar relatives ka drama zyada ho toh terrace pe escape plan. Same building hai toh easy.
She: 😂😂 Done! Terrace escape partner!
Me: Happy Diwali, neighbor!`
  },
  {
    id: 130,
    title: "Holi — Color Attack Zone",
    category: "Approach",
    text: `*Context: Holi celebration, she's trying to avoid too much color*

Me: *already fully colored* Aap abhi tak clean kaise ho?! Yeh Holi hai ya dry run?
She: 😂 Main expert hoon bachne mein.
Me: Bachne mein expert? Yeh toh Holi ka against the spirit hai!
She: Nahi, smart playing hai. Sabko color lagao, khud pe mat lagwao.
Me: Strategy! Respect. Par unfortunately... *shows colored hands*
She: Don't you dare! 😂
Me: Dare? Main toh sirf haath dikha raha tha. Innocent hoon.
She: Innocent?! Tumhari shakal pe guilt likhi hai!
Me: 😂 Okay okay, peace treaty. Holi mein bhi diplomacy chalti hai kya?
She: Mere saath chalti hai.
Me: Fine. Toh chai peete hain — yeh colored haathon se chai peena ek experience hai.
She: Eww 😂
Me: Trust me, Holi ki chai + thandai = amrit.
She: Thandai hai?
Me: Bhaiya ke stall pe — special wali. Chalo?
She: Chalo, par haath mere se door rakhna.
Me: Promise! *crosses colored fingers behind back*
She: 😂 I saw that!
Me: Oops. I'm [name], Holi ka sabse untrustworthy insaan.
She: [Her name]. Aur main sabse alert insaan. Let's go!`
  },
  {
    id: 131,
    title: "Durga Puja Pandal Hopping",
    category: "Approach",
    text: `*Context: Both pandal hopping during Durga Puja*

Me: Yeh 5th pandal hai mera aaj. Main ab pandal reviewer ban sakta hoon — "3.5 stars, good idol but bhog line too long."
She: 😂 Pandal reviewer! New career option.
Me: "Pandal #3 had best dhak sound but worst parking. Would not visit again in car."
She: 😂😂 You rate bhog too?
Me: Obviously! "Bhog quality: 4/5. Khichdi was excellent but luchi needed more frying."
She: You take this seriously!
Me: Durga Puja is serious business! Waise aap kitne cover kiye?
She: 3 abhi tak. Best wala abhi dekhna hai.
Me: Kaunsa?
She: [Pandal name].
Me: Oh I was going there next! Saath chalein? Two reviewers better than one.
She: Sure! Par main rating zyada strict hoon.
Me: Good! "Harsh but fair" — best reviewer type.
She: 😂 Let's go.
*at the pandal*
Me: Okay so — theme: 9/10, lighting: 8/10, selfie spot: 10/10 *stands next to her*
She: 😂 Selfie spot rate karna zaroori tha?
Me: Most important criteria! Google review pe photo toh daalni hai.
She: True 😂 Okay one selfie.
Me: *clicks* Perfect! I'm [name], senior pandal critic.
She: [Her name], junior critic. Next pandal?
Me: Let's go! Bhog ke liye bhi time nikalna hai!`
  },
  {
    id: 132,
    title: "Ganpati Visarjan Procession",
    category: "Approach",
    text: `*Context: Ganpati visarjan, festive chaos, loud music*

Me: *dancing next to her group* GANPATI BAPPA...
She: MORYA! 😂 Full energy!
Me: Bappa ke aage toh full dena padta hai! Waise aap kis mandal se ho?
She: [Mandal name]. Aap?
Me: Main freelance devotee hoon — kisi bhi mandal mein ghus jaata hoon.
She: 😂 Freelance devotee! First time suna.
Me: Haan, benefits hain — har mandal ka prasad milta hai, kisi ki politics mein nahi padna hota.
She: Smart system 😂
Me: Plus dancing rights everywhere. Main toh wandering dancer hoon.
She: Dancer toh lag rahe ho 😂 *watching his moves*
Me: Yeh sirf basic hai. Modak khaake energy aaye toh advanced steps dikhaunga.
She: 😂 Modak se energy aati hai?
Me: Modak is fuel! Bappa bhi modak khaake itne powerful hain.
She: 😂😂 Logic toh hai.
Me: Chalo ek round saath mein naacho — phir modak break.
She: Let's go! 🎉
*after dancing*
Me: *panting* That was fun! I'm [name].
She: [Her name]! Best visarjan ever!
Me: Next year same mandal mein milte hain — main permanent member ban jaunga tumhare mandal ka!
She: 😂 Welcome to the mandal!`
  },
  {
    id: 133,
    title: "Gurudwara Langar Seva",
    category: "Approach",
    text: `*Context: Both doing langar seva (serving food) at a Gurudwara*

Me: *serving daal* Aunty ji aur lenge? Special batch hai yeh, extra pyaar se bana hai.
She: *serving next to him, laughs* Pyaar se bana hai? Tumne banaya hai?
Me: Nahi, par serve toh main kar raha hoon — toh marketing ka haq toh hai na.
She: 😂 Marketing in langar!
Me: "Langar by [name] — served with love and slightly shaky hands."
She: Shaky hands? Nervous ho?
Me: Nervous nahi, 200 logon ko serve karna cardio hai. Arms thak gaye.
She: 😂 Gym jaane ki zaroorat nahi, langar seva karo.
Me: Exactly! "Langar Seva Fitness Program — lose weight, gain blessings."
She: 😂😂 Patent karo!
Me: Aap co-patent holder banogi? 50-50 in blessings.
She: Blessings mein 50-50? Sure 😂
Me: Done! Waheguru ji approve karenge humara partnership.
She: *laughing* You're something else.
Me: Seva ke baad chai? Langar ki chai is next level.
She: Haan langar ki chai toh best hai.
Me: I'm [name], full-time seva volunteer, part-time comedian.
She: [Her name], full-time amused by you.
Me: Best review mili aaj 😊`
  },
  {
    id: 134,
    title: "Festival Mela — Giant Wheel",
    category: "Approach",
    text: `*Context: Both in queue for giant wheel at a temple mela*

Me: Aap bhi giant wheel ke liye ho? Mujhe toh oopar jaake darr lagta hai par ego nahi maanne deta.
She: 😂 Same! Par friends ke saamne toh brave banna padta hai.
Me: Friends?
She: Woh saamne hain *points*
Me: Oh! Main toh akela hoon. Solo rider. Sad boy on a giant wheel.
She: 😂 Sad boy vibes!
Me: Haan, ek hero song play ho jayega background mein — "Tanha dil, tanha safar..."
She: 😂😂 Drama!
Me: Waise agar single seat mil jaaye toh partner chahiye — kya aap accompany karengi? Purely for safety reasons.
She: Safety reasons? 😂
Me: Haan! Agar main darrke chillaya toh koi haath pakadne wala toh chahiye.
She: 😂 Fine, since you're alone.
*on the giant wheel*
Me: *at the top* OH GOD.
She: 😂 You're actually scared!
Me: SCARED NAHI HOON, YAHI MERA BRAVE FACE HAI!
She: *laughing while he grips the bar*
Me: Dekho at least view accha hai. Woh neeche se sab chhote lag rahe hain — literally aur metaphorically.
She: 😂 Philosopher on a giant wheel.
Me: Heights pe philosophy aati hai automatically. I'm [name].
She: [Her name]. Best giant wheel ride ever!
Me: Chalo neeche jaake chaat khayein. Solid ground pe wapas aake celebrate karna chahiye!
She: 😂 Chalo!`
  },
  {
    id: 135,
    title: "Temple Photography Enthusiast",
    category: "Approach",
    text: `*Context: Both taking photos of temple architecture*

Me: *looking at her camera* Wow, DSLR! Aap professional photographer ho ya temple bahut photogenic hai?
She: 😂 Both actually. Architecture photography hobby hai.
Me: Oh nice! Main toh phone se hi shoot karta hoon — "Portrait mode on, talent off."
She: 😂 Phone cameras bhi acche hain aaj kal.
Me: Haan par DSLR wali photos alag level ki hoti hain. Woh blur, woh bokeh — *chef's kiss*
She: Bokeh pata hai aapko?
Me: Itna pata hai — background blur karo, subject sharp, photo professional lage. Baaki sab Google se seekha.
She: 😂 Honest answer!
Me: Waise woh corner wali carving dekhi? Amazing light aa rahi hai uspe.
She: Oh haan! *rushes to click*
Me: *follows* See? Main spotter hoon accha — photographer nahi par location scout zaroor.
She: Actually this is a great angle! Thanks!
Me: Location scout ka role confirm hua. Ab shoots pe bula lena — free mein kaam karunga.
She: 😂 Fees nahi?
Me: Fees: Final photos mujhe bhi bhejo aur chai milni chahiye.
She: Cheapest crew member ever 😂
Me: Budget-friendly talent hoon main. I'm [name].
She: [Her name]. I actually do weekend photo walks — join karo na?
Me: YES! Main ready hoon. Location scouting plus chai — perfect Sunday.
She: 😂 I'll add you to the group. Number do.
Me: *gives number* Best temple visit ever!`
  },
  // Cafe/Restaurant (136-150)
  {
    id: 136,
    title: "Cafe — Same Table Area",
    category: "Approach",
    text: `*Context: Crowded cafe, only shared table available, she's already sitting there*

Me: Hi, kya main yahan baith sakta hoon? Baaki sab tables pe couples baithe hain aur woh mujhe dekh ke judge kar rahe hain.
She: 😂 Sure, sit!
Me: Thanks. Main yahan akele aake "deep thinker" vibes deta hoon — actually main menu decide nahi kar paata.
She: 😂 Menu decision is hard.
Me: 15 minute lag jaate hain. Phir bhi waiter aata hai toh main panic mein "ek coffee" bol deta hoon.
She: Same! Main bhi safe option choose karti hoon.
Me: Kya order kiya aapne?
She: Cold coffee.
Me: See! Safe option! Main bhi wohi lunga. We're the same person basically.
She: 😂 Separated at birth.
Me: Exactly! Long lost sibling... wait, woh toh awkward hoga. Long lost... coffee buddy.
She: 😂😂 Coffee buddy works.
Me: Waise aap yahan kaam karti ho ya time pass?
She: Work from cafe. WFH boring ho gaya.
Me: WFC — Work From Cafe! Productivity plus ambiance plus overpriced coffee = perfect.
She: The overpriced part is real 😂
Me: 300 ki coffee mein se 200 rent hai is seat ka basically.
She: TRUE! 😂
Me: Chalo, since hum dono regulars ban rahe hain yahan — I'm [name].
She: [Her name]. See you here tomorrow?
Me: Same table, same overpriced coffee, same existential crisis. Done!`
  },
  {
    id: 137,
    title: "Cafe — WiFi Password Drama",
    category: "Approach",
    text: `*Context: You ask her for the WiFi password at a cafe*

Me: Excuse me, WiFi password pata hai? Counter pe itni lambi line hai ki mujhe lagta hai password lene mein pura din nikal jayega.
She: 😂 Haan, it's "coffee123".
Me: "coffee123"?! Itna simple? Mujhe laga koi Da Vinci Code type password hoga.
She: 😂 Haan, very creative naming.
Me: Chalo at least kaam chal gaya. Thank you, aapne meri productivity bacha li.
She: Kya kaam kar rahe ho?
Me: "Kaam" loosely use kar raha hoon — actually Netflix bhi kaam hi hai technically.
She: 😂 WFH?
Me: WFC — Work From Cafe. Ghar pe toh bed bula leta hai.
She: Same! Yahan at least guilt feel hota hai toh kuch kaam ho jaata hai.
Me: Guilt-driven productivity! Best motivation.
She: 😂 Exactly.
Me: Waise aap bhi kya kaam karti ho — Netflix ya actual kaam?
She: Actual kaam 😂 [tells her work]
Me: Oh impressive! Main toh [your work], basically professional procrastinator with a fancy title.
She: 😂 Everyone is.
Me: True. Chalo, ek deal — jab bhi yahan milein, ek dusre ko motivate karenge. "Phone rakh! Kaam kar!"
She: 😂 Accountability partner!
Me: Exactly! I'm [name], your new productivity buddy.
She: [Her name]. Deal!`
  },
  {
    id: 138,
    title: "Cafe — She's Reading a Book",
    category: "Approach",
    text: `*Context: She's reading a book at a cafe, you notice the cover*

Me: Sorry to interrupt, but woh [book name] hai? I just finished it!
She: *looks up* Oh really? Kaisi lagi?
Me: Mind. Blown. Chapter 7 ke baad toh maine book rakh ke ceiling ko 10 minute ghura tha.
She: 😂 Main chapter 5 pe hoon, no spoilers!
Me: Lips sealed! Par ek hint — tissues ready rakh lena.
She: Oh no 😂 Emotional hai?
Me: Emotional? Main toh ro diya tha. Aur main woh type hoon jo "men don't cry" follow karta hai.
She: 😂 Book ne tod diya woh rule?
Me: Completely shattered. Meri masculinity woh book padhke questionable ho gayi.
She: 😂😂 Now I'm scared to continue.
Me: Don't be! It's beautiful. Woh ending tho... *bites lip*
She: STOP! No spoilers! 😂
Me: Okay okay! But when you finish — mujhe batana. I need someone to discuss it with. Mere friends toh books padhte nahi.
She: 😂 Same, mere friends bhi nahi.
Me: Toh done — book club of two. You finish it, we discuss over coffee?
She: That sounds perfect actually.
Me: I'm [name]. Aur main tab tak next book start karta hoon taaki discussion material ready rahe.
She: [Her name]. Deal! Probably finish this week.
Me: Week?! Speed reader! Mujhe toh month laga tha. Respect!`
  },
  {
    id: 139,
    title: "Restaurant Waiting Area",
    category: "Approach",
    text: `*Context: Both waiting for a table at a popular restaurant*

Me: 45 minute wait?! Yeh restaurant hai ya government office?
She: *laughs* Seriously! Khaana accha hoga toh worth it.
Me: Agar 45 minute baad khaana average nikla toh main Google review mein essay likh dunga.
She: 😂 1-star with a 500-word rant.
Me: "Dear Manager, mera poora youth waiting area mein beet gaya. Khaana meh tha. 1 star for the AC though."
She: 😂😂 Fair review.
Me: Waise aapne try kiya hai pehle yahan?
She: Haan, food is actually amazing. Worth the wait.
Me: Oh accha! Toh recommendation kya hai? Kya order karun?
She: Butter chicken is a must. Aur garlic naan.
Me: Butter chicken! A person of culture. Main toh wahi khaane aaya hoon.
She: Then you'll love it.
Me: Aapki recommendation pe trust kar raha hoon — agar accha nahi nikla toh complaint aapke paas aayegi.
She: 😂 Main guarantee deti hoon.
Me: Written guarantee? Notarized? 😂
She: Verbal hai, take it or leave it.
Me: Chal, verbal chalegi. Waise since 40 minute aur hain — I'm [name].
She: [Her name].
Me: [Her name], agar table saath mein mil jaaye toh butter chicken ki taarif saath mein karenge?
She: 😂 Bold. But sure, why not.
Me: Best! Hunger brings people together — yeh toh proven fact hai.`
  },
  {
    id: 140,
    title: "Ice Cream Parlor — Flavor Confusion",
    category: "Approach",
    text: `*Context: Both staring at 50+ flavors at an ice cream parlor*

Me: *staring at menu* Yeh ice cream shop hai ya life ka sabse bada decision-making test?
She: 😂 Right?! Kitne flavors hain!
Me: Main 10 minute se khada hoon. Staff soch rahi hai mujhe koi mental issue hai.
She: Main bhi 5 minute se decide nahi kar paayi.
Me: Chalo ek system banate hain — aap ek flavor choose karo, main ek, phir taste share karenge.
She: Oh nice idea!
Me: See? Crisis mein main genius ban jaata hoon.
She: 😂 Okay I'll go with... Belgian Chocolate.
Me: Belgian Chocolate — classic! Main Salted Caramel lunga.
She: Salted Caramel! Good choice.
Me: *orders* Cheers! *taps cones together*
She: 😂 Ice cream cheers?
Me: First time?
She: Yes 😂
Me: Main ice cream mein innovative hoon. Taste karo mera?
She: Mmm this is good! Try mine.
Me: *tries* Oh wow, accha hai par Salted Caramel still wins.
She: No way! Chocolate is superior!
Me: Yeh toh debate hai! Ice cream supremacy war.
She: 😂 Fight!
Me: Settle karte hain — next week, new flavors, round 2?
She: 😂 Deal! I'm [her name].
Me: [Name]. Ice cream rivalry starts now!`
  },
  {
    id: 141,
    title: "Street Momos Stall",
    category: "Approach",
    text: `*Context: Both at a famous street momos stall, waiting for order*

Me: Bhaiya kitna time aur? Mera toh momos ka sapna aane laga hai wait karke.
She: *laughs* 10 minute bol rahe the, 20 ho gaye.
Me: Momos ke liye wait karna — yeh sabr ki pariksha hai. Bhagwan test le rahe hain.
She: 😂 Tough test hai.
Me: Steam ya fried?
She: Steam.
Me: STEAM?! Aap healthy type ho? Fried momos nahi khaate?
She: Fried bhi khati hoon par steam better hai.
Me: "Better" hai par "tastier" nahi. Fried momos ke saamne steam wale toh interns lag-te hain.
She: 😂 Interns! Mean!
Me: Sorry steam momos, par truth is truth.
She: Ek try karo mera steam wala with red chutney — opinion badal jayega.
Me: Challenge accepted! Agar opinion badal gaya toh main publicly apologize karunga steam momos se.
She: 😂 And if not?
Me: Toh aap fried try karogi. Fair?
She: Deal!
*food arrives, they exchange*
Me: *eats steam momo with chutney* ... Okay this is... actually... good.
She: HA! 😂
Me: Main apologize nahi karunga publicly but privately... haan, accha hai.
She: 😂 I'll take that. I'm [her name].
Me: [Name]. Momos debate partner for life!`
  },
  {
    id: 142,
    title: "Chai Tapri — Evening",
    category: "Approach",
    text: `*Context: Evening chai at a small tapri, both standing and sipping*

Me: *sipping* Kuch logon ke liye therapy 2000 ki hai. Mere liye 10 ki chai hai.
She: *laughs* So true.
Me: Ek sip mein saare problems solve ho jaate hain... 5 minute ke liye.
She: 😂 Temporary fix.
Me: Haan par affordable hai! Therapist se sasta toh hai.
She: Budget mental health 😂
Me: "Dr. Chai Wala — 10 rupees, all problems solved. Side effects: addiction."
She: 😂😂 Accha tagline hai.
Me: Roz aati ho yahan?
She: Haan, office ke baad ritual hai mera.
Me: Same! Yeh tapri wala bhaiya meri life ka constant hai — girlfriend nahi hai, job change ho jaati hai, par bhaiya ki chai wahin hai.
She: 😂 Emotional attachment with chai wala.
Me: Deep connection hai. Woh mera order yaad rakhta hai bina bole — relationship goals.
She: 😂 Mere saath bhi same — "didi, cutting?"
Me: See! Bhaiya knows us better than most humans.
She: True story 😂
Me: Chalo toh — chai buddies? Roz same time, same tapri?
She: Why not 😊 I'm [her name].
Me: [Name]. Kal se cutting double order!`
  },
  {
    id: 143,
    title: "Dhaba — Highway Stop",
    category: "Approach",
    text: `*Context: Both stopped at a highway dhaba during a road trip*

Me: *looking at menu board* "Special thali" — bhaiya, special kya hai isme? Extra pyaaz?
She: *at next table, laughs*
Me: Oh sorry, loud tha? Main dhaba pe volume control kho deta hoon.
She: 😂 Nahi, actually accha question tha.
Me: Road trip pe ho?
She: Haan, friends ke saath. Woh washroom gaye.
Me: Same, par main akela hoon. Solo trip.
She: Solo trip! Brave!
Me: Brave nahi, broke. Friends ka schedule match nahi karta toh akele nikal gaya. Ab khana bhi akele kha raha hoon — sad movie scene.
She: 😂 Itna sad mat bolo, yahan baith jaao.
Me: Seriously? Thanks! *sits* Main toh sad story isliye bola tha taaki invite mile.
She: 😂 Manipulative!
Me: Strategic. Dhaba pe akele khaana is against my values.
She: 😂 Kahan ja rahe ho?
Me: [Place]. You?
She: Oh same direction! Hum [nearby place].
Me: Destiny! Highway pe milna — yeh toh Bollywood material hai.
She: 😂 Film ka naam kya hoga?
Me: "Dhaba Pe Dil" — coming soon.
She: 😂😂 Blockbuster.
Me: I'm [name], solo traveler with too many jokes.
She: [Her name]. Safe travels aur funny raho!`
  },
  {
    id: 144,
    title: "Bakery Queue — Morning",
    category: "Approach",
    text: `*Context: Both in a bakery queue for fresh bread/cake*

Me: *smelling deeply* Bakery ki smell ko bottle mein bhar ke bech dein toh crorepati ban jayenge.
She: 😂 True, instant mood fix.
Me: Main toh ek bar bakery ke andar so gaya tha in my dreams — best dream ever.
She: 😂 Dream bakery!
Me: Alarm bajne pe toh laga jaise paradise se nikaal diya.
She: Relatable dreams 😂 Kya le rahe ho?
Me: Bread toh chahiye, par woh chocolate pastry mujhe bula rahi hai.
She: Same dilemma! Healthy choice ya tasty choice?
Me: Yeh jo healthy vs tasty debate hai na — main always tasty ke saath hoon. Life mein bahut kuch healthy nahi hai, at least khaana toh tasty ho.
She: 😂 Philosophy in a bakery queue.
Me: Bakery mein sab philosopher ban jaate hain. Kuch sweet dekhte hain toh life sweet lagti hai.
She: Deep! 😂
Me: Chalo, dono chocolate pastry lete hain. No judgement zone.
She: No judgement! 😂 Let's do it.
Me: *orders two* Cheers! *holds up pastry*
She: 😂 Pastry cheers!
Me: I'm [name], bakery philosopher.
She: [Her name]. Best bakery visit ever!`
  },
  {
    id: 145,
    title: "Food Court — Only Seat Near Her",
    category: "Approach",
    text: `*Context: Mall food court, only open seat is across from her*

Me: Hi, yeh seat khaali hai? Poora food court full hai, main 3 rounds laga chuka hoon tray leke.
She: 😂 Haan please, sit!
Me: Thank god! 3 rounds mein mera khaana thanda ho raha tha aur meri izzat bhi.
She: 😂 Izzat?
Me: Haan, logo ne dekha hoga — "Yeh banda tray leke ghoom raha hai, koi seat nahi de raha. Bechara."
She: *laughing* Itna bhi nahi hoga.
Me: You don't know food court politics! Seat mafia hai yahan. Log ek chai ke saath 2 ghante baithe rehte hain.
She: 😂 True! Woh corner wala banda toh subah se hai lagta hai.
Me: Uska toh ghar shift ho gaya hai yahan. Kal mattress laayega.
She: 😂😂
Me: Waise kya kha rahi ho?
She: Pasta. You?
Me: Biryani. The eternal debate — Italian vs Indian.
She: No debate. Both are great.
Me: Diplomatic answer! Par agar ek hi choose karna ho?
She: Biryani 😂
Me: YES! My kind of person! I'm [name].
She: [Her name]. Enjoy your biryani, seat partner!`
  },
  // Gym/Sports (146-160)
  {
    id: 146,
    title: "Gym — Water Cooler Break",
    category: "Approach",
    text: `*Context: Both at the gym water cooler, catching breath*

Me: *drinking water like I just crossed a desert* Main toh sochta tha gym mein body banti hai. Body toh toot rahi hai.
She: 😂 First month?
Me: Does it show?
She: Thoda 😂
Me: Meri body ka Google review abhi "1 star — not as advertised" hai.
She: 😂 It gets better, trust me.
Me: Kitne time se aa rahi ho?
She: 2 years.
Me: 2 YEARS?! Respect! Main toh 2 weeks mein hi retirement plan bana raha hoon.
She: 😂 Don't give up!
Me: Give up nahi karunga par trainer se zaroor ladai hogi. Usne aaj 50 squats karwaye — meri legs ne resignation letter likhi hai.
She: 😂 Squats are the worst!
Me: "The worst" is generous. Squats are torture designed by someone who hates happiness.
She: 😂😂 Par results acche aate hain.
Me: Results ke liye aaya hoon, par process mein meri aatma nikal rahi hai.
She: Hang in there! Main bhi pehle aise hi thi.
Me: Really? Toh aap meri gym mentor banogi? Guidance chahiye ek senior se.
She: 😂 Senior bol diya?
Me: Experience ke hisaab se! Respectfully!
She: Fine, mentor ban jaati hoon. I'm [her name].
Me: [Name]. Kal leg day pe bachana mujhe!
She: 😂 No promises on leg day!`
  },
  {
    id: 147,
    title: "Badminton Court Partner Hunt",
    category: "Approach",
    text: `*Context: Badminton court, she's practicing alone, you need a partner*

Me: Excuse me, aapka partner nahi aaya?
She: Nahi, cancel kar diya last minute.
Me: Same! Mera bhi. Yeh partners nahi milte — yeh toh relationship issues hain sports mein.
She: 😂 Commitment issues.
Me: "Bro kal pakka" — biggest lie after "5 minute mein aata hoon."
She: 😂 SO TRUE.
Me: Toh kya hum dono abandoned souls ek saath khelen?
She: Sure! Par main acchi hoon, warning de rahi hoon.
Me: Oh? Main bhi accha hoon... apni imagination mein.
She: 😂 Let's see then.
*they play, she's clearly better*
Me: *missing another shot* Yeh shuttle mujhse personal problem rakh rahi hai.
She: 😂 Shuttle nahi, tumhari timing off hai.
Me: Timing toh life mein bhi off hai meri, badminton kya cheez hai.
She: 😂 Ek tip — wrist use karo, arm nahi.
Me: *tries, slightly better* Oh! Kuch kuch hua!
She: See! Coachable ho tum.
Me: Best compliment ever. Coach bani rehna please.
She: 😂 Fees lagegi.
Me: Cold coffee?
She: Done!
Me: I'm [name], world's most enthusiastic beginner.
She: [Her name]. Same time tomorrow?
Me: Same time, aur main practice karke aaunga. YouTube tutorial dekhunga raat ko.
She: 😂 YouTube coach + me = pro ban jaoge!`
  },
  {
    id: 148,
    title: "Yoga Class — Inflexible Guy",
    category: "Approach",
    text: `*Context: Yoga class, you clearly cannot do most poses*

Me: *struggling in a pose* Mujhe lagta hai meri body mein joints nahi, cement hai.
She: *next mat, laughing* Dheere dheere hoga.
Me: Instructor bol rahi hai "relax" — bro, main is position mein relax kaise karoon? Yeh toh interrogation pose hai.
She: 😂 Which pose?
Me: Jo bhi hai — mujhe toh sab "near-death experience" lag rahi hain.
She: 😂😂 First class?
Me: Haan, aur possibly last.
She: Noo! Don't quit. Pehle din tough hota hai.
Me: Tough? Mere haathon ne toh already union form kar liya hai — "We demand better working conditions."
She: 😂 Just breathe through it.
Me: Breathe bhi toh instructor bataye — "inhale... exhale... now pretend you're a tree." TREE?! Main hardly human ban paa raha hoon!
She: *laughing so hard she falls out of pose*
Me: Hey! Meri wajah se aapka pose toot gaya! Sorry!
She: 😂 It's fine, this is more fun than actual yoga.
Me: Entertainment value high hai mera. I'm [name].
She: [Her name]. Kal bhi aana, mujhe comic relief chahiye class mein.
Me: Done! Main aaunga, suffer karunga, aur aapko hasaunga. Win-win!`
  },
  {
    id: 149,
    title: "Cricket Match — Stadium Audience",
    category: "Approach",
    text: `*Context: Cricket stadium, sitting next to each other*

Me: *team gets a wicket* YESSS! *accidentally high-fives her*
She: 😂 Oh! High five?
Me: Sorry, excitement mein! Aap bhi [team name] support karti ho?
She: HAR DIN! Die-hard fan!
Me: Oh my god, FINALLY koi mila! Mere friends sab [rival team] support karte hain. Main akela warrior hoon.
She: Same! Lone fighter in friend group!
Me: Yeh toh bhai-behen ka rishta hai... wait, woh nahi. Yeh toh... team-mates ka rishta hai!
She: 😂 Team-mates!
Me: Chalo next boundary pe proper celebration karenge. Ready?
She: Ready! 🏏
*boundary happens*
Both: YAAAAAS! *high five*
Me: See? Chemistry hai humari — celebration mein at least!
She: 😂 On-field chemistry!
Me: Waise snacks khaoge? Main chole lene ja raha hoon.
She: Chole! Yeh bhi common hai?!
Me: 😂 Stadium chole > everything. Main le aata hoon.
*comes back with two plates*
Me: Chole for the champion fan!
She: Thank you! I'm [her name].
Me: [Name]. Next match bhi saath dekhenge?
She: Only if humari team khel rahi hai!
Me: Obviously! I'll book tickets side by side. Official match buddies!
She: 🏏 Done!`
  },
  {
    id: 150,
    title: "Marathon Registration Counter",
    category: "Approach",
    text: `*Context: Both registering for a marathon, she's in running gear*

Me: *looking at form* "10K, 21K, or Full Marathon" — yeh running hai ya choose your suffering level?
She: 😂 Kaun sa le rahe ho?
Me: 10K. Kyunki main apni limitations jaanta hoon. 21K mein mujhe ambulance bhi book karni padegi.
She: 😂 I'm doing 21K!
Me: 21?! Respect! Aap toh warrior ho. Main 10K mein bhi last aaunga probably.
She: Last aane mein bhi pride hai — at least finish toh kiya!
Me: "At least finish toh kiya" — yeh mera life motto hai.
She: 😂 Good motto!
Me: Waise training kaise kar rahi ho?
She: Roz 7-8 km running. 3 months se prep hai.
Me: 3 months?! Main kal register kiya aur marathon parson hai basically.
She: 😂 Kal register kiya?!
Me: Haan, impulse decision. 3 am ko Instagram pe "You can do anything" wali reel dekhi, aur sign up kar diya.
She: 😂😂 Motivation at 3 am is dangerous!
Me: Very dangerous. Ab regret at 3 pm ho raha hai.
She: Koi nahi, I'll give you some tips. Basics se kaam chal jayega.
Me: Tips?! You'd do that?! Aap angel ho literally!
She: 😂 Angel nahi, fellow runner.
Me: I'm [name], accidental marathon participant.
She: [Her name]. Training start karte hain kal se!
Me: Kal se?! Okay... kal se... *gulps*`
  },
  // College/Library/Bookstore (151-165)
  {
    id: 151,
    title: "Bookstore — Same Section",
    category: "Approach",
    text: `*Context: Both in the fiction section of a bookstore, reaching for the same book*

Me: *hand touches hers on the book* Oh sorry! Aap pehle.
She: No you take it!
Me: Nahi nahi, ladies first. Main gentleman mode mein hoon.
She: 😂 Sure?
Me: Bilkul. Par ek condition — review dena padhke. Main toh iske reviews pe hi jee raha hoon.
She: 😂 Deal. Waise tum bhi [author] padhte ho?
Me: PADHTA hoon?! Fan hoon! Matlab shrine banana baaki hai ghar pe.
She: 😂 Same level!
Me: Finally koi mila jo samajhta hai! Mere friends ko bol-ta hoon "yeh book padho" — woh bolte hain "summary bhej de."
She: 😂 SAME! Meri friend ne bola "audio book sun lena."
Me: Audio book?! Blasphemy! Book ka smell, pages, bookmark — yeh sab experience hai!
She: EXACTLY! Kindred spirit ho tum.
Me: Kindred spirit — bookstore mein mila. Yeh toh novel ka plot hai.
She: 😂 Chapter 1: The Bookstore.
Me: Chapter 2: Coffee ke saath book discussion.
She: Bold! 😂 Accha, recommend karo kuch.
Me: [Book name] — life changing hai. Agar nahi roya toh I'll refund the recommendation.
She: 😂 Money-back guarantee on book recs! I'm [her name].
Me: [Name]. Coffee chapter kab likhein?
She: Finish kar lein yeh dono books, phir discuss!
Me: Done! Reading speed badhata hoon!`
  },
  {
    id: 152,
    title: "Library — Adjacent Seat",
    category: "Approach",
    text: `*Context: Library, you sit next to her, both studying*

Me: *whispers* Excuse me, yeh pen chal rahi hai check karna tha. *scribbles on paper* Haan chal rahi hai. Thanks for witnessing.
She: *confused laugh-whisper* Kya?
Me: Sorry, 3 ghante se padh raha hoon, brain ne comedy mode on kar diya hai.
She: 😂 *whispering* Kya padh rahe ho?
Me: [Subject]. Aap?
She: Same exam!
Me: Oh! Competitor hai toh. *pretends to cover notes*
She: 😂 *whispering* Notes nahi chaahiye tumhare, meri apni strategy hai.
Me: Strategy? Meri strategy hai — "Padh lo jo bhi ho, paper mein adjust kar lenge."
She: 😂 Bold strategy.
Me: "Fortune favors the unprepared" — Maine bola, kisi philosopher ne nahi.
She: 😂 *librarian looks at them*
Me: *silent for 2 min, then slides a note* "Chai break? 15 min?"
She: *writes back* "10 min. Downstairs canteen."
*at canteen*
Me: Freedom! Library mein itna time = jail sentence.
She: Seriously! Par results chahiye toh karna padta hai.
Me: True. Waise notes share karein? Main [topic] mein weak hoon.
She: Main [other topic] mein. Exchange?
Me: Study partner mil gaya! Exam ke baad celebration plan bhi karna hai.
She: Pehle pass toh ho jayein 😂
Me: Positive thinking! I'm [name].
She: [Her name]. Back to jail now?
Me: Chalo, 2 aur ghante. Then another chai break!`
  },
  {
    id: 153,
    title: "College Fest — Lost in Crowd",
    category: "Approach",
    text: `*Context: College cultural fest, loud music, she's looking around lost*

Me: *shouting over music* Aap bhi kisi ko dhoondh rahi ho ya existentially lost ho?
She: *laughs* Friends ko dhoondh rahi hoon! Network nahi aa raha!
Me: Same problem! Mera phone bhi signal dhoondh raha hai jaise main friends dhoondh raha hoon — desperately.
She: 😂 Fest mein signal = impossible.
Me: Ek solution hai — hum dono temporarily friends ban jaate hain jab tak real friends milte nahi.
She: 😂 Temporary friends!
Me: Trial period with option to extend!
She: Okay deal! Kya karna hai fest mein?
Me: Sab kuch! Pehle woh band sun-te hain, phir food stalls, phir comedy show.
She: Plan toh accha hai!
Me: Kyunki main "plan banana par follow na karna" mein expert hoon. Aaj follow bhi karunga.
She: 😂 I'll hold you accountable.
Me: Accountability partner + temporary friend = basically best friend already.
She: 😂 Fast friendship!
Me: College fest mein sab fast hota hai — fast food, fast music, fast friendships.
She: True 😂 Let's go!
*after the fest*
Me: Best fest ever! Temporary se permanent friend upgrade?
She: Upgraded! 😊 I'm [her name].
Me: [Name]. Instagram exchange? Taaki next fest mein "friends dhoondh-na" na pade.
She: Smart! *exchanges*`
  },
  {
    id: 154,
    title: "Coaching Class — Break Time",
    category: "Approach",
    text: `*Context: Coaching class break, both at the water cooler/snack area*

Me: Bhai woh teacher ne jo formula bataya na — usne mera brain format kar diya.
She: 😂 Kaunsa?
Me: Jo bhi tha — main toh "hmm hmm" karte reh gaya, samjha kuch nahi.
She: 😂 Main notes de dungi.
Me: Seriously?! Tum angel ho! Meri notes mein sirf doodles hain aur "HELP" likha hua hai.
She: 😂 HELP?
Me: Haan, emergency signal for future me who reads these notes.
She: Future you will be confused 😂
Me: Future me is always confused. Present me bhi confused hai. Past me ne coaching join karke confusion start kiya.
She: 😂 Itna confused aur still coming to class?
Me: Attendance marks, dost. 75% chahiye!
She: Same same 😂
Me: Waise kya plan hai? IIT? NEET?
She: [Exam].
Me: Same! Toh competition hai technically — par main itna behind hoon ki competition nahi, participation hai.
She: 😂 Participation trophy!
Me: Mujhe woh bhi de dein toh grateful rahunga. I'm [name].
She: [Her name]. Kal woh formula samjha dungi.
Me: Teacher nahi samjha paayi, tum samjha dogi?
She: 😂 Better teacher hoon.
Me: Already!`
  },
  {
    id: 155,
    title: "Co-Working Space — Printer Queue",
    category: "Approach",
    text: `*Context: Both waiting for the shared printer at a co-working space*

Me: Yeh printer 1999 ka hai ya mujhe aisa lag raha hai?
She: 😂 It does print like it's from another era.
Me: "Printing page 1 of 10" — bro, meri retirement tak ho jayega toh bata.
She: Main bhi 20 minutes se wait kar rahi hoon!
Me: 20 minutes! Iss time mein toh haath se likh dete.
She: 😂 Haath se likhna faster hoga actually.
Me: "Co-working space — modern amenities including a printer from the Jurassic era."
She: Google review mein daal do 😂
Me: 1 star — "WiFi fast, printer slow, coffee mid, people interesting." *looks at her*
She: 😂 Smooth!
Me: Waise kya print kar rahi ho? Agar personal nahi hai toh.
She: Client presentation.
Me: Client presentation on THIS printer? Brave.
She: Options nahi hain 😂
Me: Koi nahi, main moral support dunga. Har page pe clap karunga.
She: 😂 Please do.
*printer finally works*
Me: *claps* PAGE 1! LADIES AND GENTLEMEN, PAGE 1!
She: 😂😂 Stop!
Me: I'm [name], printer hype man.
She: [Her name]. Best print experience ever somehow!`
  },
  {
    id: 156,
    title: "Art Exhibition Opening",
    category: "Approach",
    text: `*Context: Art exhibition, both staring at an abstract painting*

Me: *staring* Mujhe isme ek confused parrot dikh raha hai. Aapko?
She: *laughs* Mujhe toh sunset lag raha tha.
Me: Sunset?! Kahan?! Main toh parrot dhundh raha hoon ab isme.
She: 😂 Abstract art hai, jo dikhe woh sahi.
Me: Toh agar mujhe pizza dikhe toh?
She: 😂 Toh tumhe bhookh lagi hai, art nahi samajh aa rahi.
Me: Accurate diagnosis! Main actually hungry hoon. Par art ke baare mein intelligent sound karna hai toh "hmm, interesting use of negative space" bolna padta hai.
She: 😂 Pro tip: "The juxtaposition is fascinating" bol do.
Me: "The juxtaposition is FASCINATING" — wow, I sound like a critic already!
She: 😂 Art gallery ready ho tum.
Me: Aap regularly aati ho exhibitions mein?
She: Haan, art lover hoon.
Me: Oh nice! Main newbie hoon — first exhibition. Guide ban jaogi?
She: Sure! Woh installation dekhni hai? Bahut acchi hai.
Me: Lead the way, art guru! Main peeche peeche "hmm interesting" bolta rahunga.
She: 😂 Please do. I'm [her name].
Me: [Name]. After this, coffee pe art discussion? I need to sound cultured.
She: 😂 Coffee pe beginner's class duungi.
Me: Enrollment confirmed!`
  },
  {
    id: 157,
    title: "Hackathon — Team Formation",
    category: "Approach",
    text: `*Context: Hackathon event, she's looking for team members*

Me: *holding laptop awkwardly* Aap bhi "team nahi mili" gang mein ho?
She: 😂 Haan, meri team cancel kar gayi.
Me: Same story! "Bro kal nahi aa payunga" — 12 ghante pehle bola.
She: Worst feeling!
Me: Chalo, abandoned souls ek team banate hain? Hum dono plus koi aur mil jayega.
She: Okay! Kya stack use karte ho?
Me: React, Node. You?
She: Python, ML.
Me: Oh perfect! Frontend + ML = OP team! Bas ek designer chahiye.
She: Woh random guy dekho — woh bhi akela lag raha hai.
Me: *calls him* Bhai, designer ho?
Guy: Haan!
Me: TEAM COMPLETE! Avengers assemble moment hai yeh.
She: 😂 Avengers!
Me: Main Iron Man, tum Scarlett Johansson... matlab Black Widow.
She: 😂 Nice try!
Me: Okay team name — suggestions?
She: "Last Minute Legends"?
Me: GENIUS! Because that's exactly what we are.
She: 😂 Let's win this!
Me: Even if we don't win, yeh origin story toh mast hai. I'm [name].
She: [Her name]. Let's code!
Me: After chai. No coding without chai — that's our team rule #1.`
  },
  {
    id: 158,
    title: "Canteen Queue — College",
    category: "Approach",
    text: `*Context: College canteen, long queue, both hungry*

Me: Is queue mein itna time lag raha hai ki jab tak khaana milega, lunch ka time nikal jayega aur dinner shuru ho jayega.
She: 😂 Haan, roz ka hai yeh.
Me: Canteen wale bhaiya ka speed — buffering jaisa. 
She: 😂 Buffering!
Me: "Your samosa is loading... 45%... please wait."
She: 😂😂 Kya loge?
Me: Samosa aur chai — India ka national lunch.
She: Same!
Me: See, great minds think alike. Or broke minds — depends on perspective.
She: Both 😂
Me: Fair. Waise kaunsa department?
She: [Department].
Me: Oh! Toh tum woh building mein ho jahan WiFi best aata hai!
She: 😂 WiFi ke basis pe department rate kar rahe ho?
Me: Priority hai bhai. Padhai toh hogi nahi, at least memes toh load hone chahiye.
She: 😂 Logical.
Me: Waise canteen ke samosa ke alawa life mein aur kya plan hai?
She: MBA soch rahi hoon.
Me: MBA! "Master of Being Awesome" — already qualified ho.
She: 😂 Cheesy! Par thanks.
Me: I'm [name], Chief Canteen Officer of this college.
She: [Her name]. CCO se milke accha laga!`
  },
  {
    id: 159,
    title: "Cultural Event — Dance Performance",
    category: "Approach",
    text: `*Context: After her dance performance at a cultural event*

Me: *walks up after performance* Woh last step mein aapne jo spin kiya na — mujhe chakkar aa gaya dekhke.
She: 😂 Thank you!
Me: Seriously, amazing tha! Kitne time se dance kar rahi ho?
She: 10 years now.
Me: 10 years! Main 10 minute dance karu toh mera body "unsubscribe" kar deta hai.
She: 😂 Everyone can dance!
Me: Nahi, main "everyone" mein nahi aata. Maine ek baar wedding mein dance kiya tha — mere mama ne bola "beta, tu DJ ke paas khada reh bas."
She: 😂😂 Harsh!
Me: Harsh but fair. Waise kaunsa dance form?
She: [Dance form].
Me: Oh wow! Main toh naam bhi sahi se pronounce nahi kar paunga but I respect the art deeply.
She: 😂 It's fine. Kya pronunciation karte ho?
Me: *tries, butchers it*
She: 😂😂 Close enough!
Me: See? Dedicated student hoon. Agar class mein ek beginner spot hai toh mujhe le lo — entertainment guarantee.
She: 😂 Beginners batch hai actually.
Me: Wait really?! Main seriously interested hoon. Two left feet hai par enthusiasm infinite hai.
She: 😂 Join karo! I'll help.
Me: Done! I'm [name], soon-to-be worst dancer in your batch.
She: [Her name]. Par worst se best bante hain!
Me: Yeh toh motivational poster material hai. Chalo start karte hain!`
  },
  {
    id: 160,
    title: "Farewell Party — Photo Booth",
    category: "Approach",
    text: `*Context: College farewell, photo booth area*

Me: *picking up funny props* Yeh toh "adult at a kid's party" wali feeling hai.
She: 😂 Props choose karo na! Funny waale lo.
Me: *picks oversized sunglasses and mustache* How do I look?
She: 😂 Like someone's drunk uncle at a wedding.
Me: PERFECT! That's the aesthetic I was going for.
She: 😂 Main yeh tiara le rahi hoon.
Me: Tiara + mustache — humari photo historic hogi.
She: 😂 Click karo!
Me: *selfie together* Masterpiece! Yeh toh farewell ka best photo hai.
She: Send karo mujhe!
Me: Instagram pe tag karun ya WhatsApp?
She: Both 😂
Me: Greedy! 😂 But okay. Waise farewell emotional lag rahi hai?
She: Thoda haan. 4 saal nikal gaye.
Me: Same feeling. Par ek cheez acchi hui — last din pe nayi dosti ho gayi.
She: 😂 Better late than never?
Me: Exactly! 4 saal late hoon but quality time matters, not quantity.
She: Deep for a guy wearing a fake mustache 😂
Me: Mustache adds wisdom. It's science.
She: 😂 I'm [her name].
Me: [Name]. Stay in touch? Monthly meetup — same props, different venue.
She: 😂 Done! Monthly mustache-tiara meetup!`
  },
  // Events/Social (161-170)
  {
    id: 161,
    title: "Wedding Function — Buffet Line",
    category: "Approach",
    text: `*Context: Indian wedding, both at the buffet line*

Me: *loading plate* Shaadi ka khaana itna accha kyun hota hai? Rishta kisi aur ka, celebration meri.
She: 😂 Best part of any wedding.
Me: Main toh sirf khaane aata hoon. Dulha-dulhan ka naam bhi yaad nahi sometimes.
She: 😂 Aaj kiska hai?
Me: Mera cousin ka... I think. Family tree complicated hai.
She: 😂 Mera friend ka hai.
Me: Oh nice! Bride side ya groom side?
She: Bride side.
Me: Main groom side. Technically hum toh rivals hain — par buffet mein ceasefire.
She: 😂 Buffet pe sab ek hain.
Me: Democracy at its finest — plate mein sab equal. Waise paneer recommend karungi? Main confuse hoon paneer ya chicken.
She: Both lo! Shaadi hai, diet baad mein.
Me: "Diet baad mein" — yeh mera life philosophy hai!
She: 😂 Same!
Me: Chalo saath mein baithe hain? Woh corner table pe jagah hai.
She: Sure! Wahan AC bhi accha chal raha hai.
Me: AC + food + good company = perfect wedding formula.
She: 😂 Agreed.
Me: I'm [name], professional wedding guest.
She: [Her name], fellow professional!
Me: Dance floor pe milte hain baad mein? DJ ne "London Thumakda" baja di toh toh jaana padega.
She: 😂 Mandatory hai woh toh!`
  },
  {
    id: 162,
    title: "House Party — Balcony Escape",
    category: "Approach",
    text: `*Context: Loud house party, both escape to balcony for fresh air*

Me: Balcony pe bhi aa gayi? Andar ka scene zyada ho gaya?
She: *laughs* Haan, DJ ne volume itna loud kar diya ki mere thoughts bhi sun nahi paa rahi thi.
Me: Same! Main andar apna naam bhi bhool gaya tha kuch der ke liye.
She: 😂 Name identity crisis at a party.
Me: Haan, koi bola "Hey!" Main sochta raha — "Yeh mujhe bol raha hai ya music?"
She: 😂 Relatable.
Me: Waise tum host ki friend ho?
She: Haan, college se. You?
Me: Office se. Basically main "plus one of a plus one" hoon. Nobody really knows me here.
She: 😂 Anonymous party guest!
Me: Haan, mysterious stranger vibes. Spy movie jaisa.
She: James Bond of house parties 😂
Me: Bond ko toh martini milti thi, mujhe sirf Sprite mila hai.
She: 😂 Budget Bond.
Me: Local Bond. 007 ka 007% budget.
She: *laughing hard*
Me: Chalo, since dono yahan hain — introductions properly? I'm [name].
She: [Her name].
Me: Nice! Ab hum officially "know each other at this party" hai. Andar ja ke kisi ne poocha "tum kisko jaante ho?" toh ek dusre ka naam le lenge.
She: 😂 Mutual alibi!
Me: Exactly! Partners in party crime!`
  },
  {
    id: 163,
    title: "Comedy Show — Audience",
    category: "Approach",
    text: `*Context: At a standup comedy show, sitting next to her*

Me: *comedian says a joke, both laugh at the same time*
Me: Same timing pe hasi aayi — comedic compatibility confirmed!
She: 😂 That's a thing?
Me: Bilkul! "Couples who laugh together, last together" — Maine abhi banaya yeh quote.
She: 😂 Original quote hai?
Me: Patent pending. Waise aap kiska fan ho comedy mein?
She: Zakir Khan!
Me: ZAKIR! "Sakht launda" — legend! Main toh Biswa aur Abhishek Upmanyu bhi sun-ta hoon.
She: Upmanyu best hai!
Me: "Mummy" waala set — masterpiece. 15 baar dekha.
She: SAME! "Shaadi mein khaana" wala part 😂
Me: "Aunty, paneer kahan hai?!" 😂 ICONIC!
She: We have the same taste!
Me: Clearly! Toh next show saath mein? Main tickets book karta hoon — solo jaana toh boring hai.
She: Hmm saath mein more fun hoga 😂
Me: That's a yes! I'm [name].
She: [Her name]. Next kiska show hai?
Me: Check karta hoon — whoever it is, we're going. Deal?
She: Deal! 😊`
  },
  {
    id: 164,
    title: "Train Journey — Side Berth",
    category: "Approach",
    text: `*Context: Train journey, she's on the side lower berth, you're on upper*

Me: *peeking down* Excuse me, aapke paas charging point hai? Mera phone dying hai — like literally last 2%.
She: *laughs* Haan, yeh lo. *offers charger*
Me: Thank you! Aapne meri digital life bacha li. Bina phone ke train journey = 1800s.
She: 😂 True, what would you even do?
Me: Window se bahar dekhna... 5 minute ke baad boring. Sone ka try... train ki rhythm sync nahi hoti. So basically — suffer.
She: 😂 Kitni door jaana hai?
Me: [City]. 14 ghante ka journey.
She: Oh same train toh hai, main [nearby city].
Me: Nice! Toh 12 ghante saath hain. Kuch toh karna padega.
She: Cards hai?
Me: Cards nahi par main stories suna sakta hoon — mostly made up par entertaining.
She: 😂 Made up stories?
Me: Haan — "Ek baar main train mein tha, aur ek alien aaya..." type.
She: 😂 I'll listen. Boring toh nahi hoga at least.
Me: Guarantee! Aur agar boring laga toh you can throw me off the train at next station.
She: 😂 Fair deal. I'm [her name].
Me: [Name]. Ab phone charge ho raha hai toh memes bhi dikha sakta hoon.
She: Memes > stories!
Me: Valid! Meme marathon it is!`
  },
  {
    id: 165,
    title: "Elevator — Office Building",
    category: "Approach",
    text: `*Context: Stuck in a slow elevator together in an office building*

Me: Yeh elevator hai ya time machine? — 1st floor se 10th tak jaane mein itna time lagta hai ki meri next birthday aa jayegi.
She: 😂 Seriously, slowest elevator ever.
Me: Main stairs se jaata hoon usually — par aaj laziness jeet gayi.
She: Same! Regret ho raha hai ab.
Me: Regret toh hota hai par stairs se paseena aata hai, aur phir office mein "yeh gym se aa raha hai kya" wali looks milti hain.
She: 😂 Accurate!
Me: Kaunsi floor?
She: 8th.
Me: Main 10th. Toh 2 floors aur suffer karunga aapke baad.
She: 😂 Sorry for your extended suffering.
Me: It's okay, main toh aadat se majboor hoon. Waise kya kaam karti ho?
She: [Company/Role].
Me: Oh nice! Main [your role] — basically same building mein kaam karte hain aur pehli baar baat ho rahi hai.
She: Elevator icebreaker 😂
Me: Best kind! No awkward "let me introduce myself" — direct suffering bond.
She: 😂 Trauma bonding lite.
Me: Exactly! Chalo, since hum building-mates hain — lunch kabhi saath mein?
She: Sure! 12th floor cafeteria?
Me: 12th floor?! Uske liye toh definitely elevator chahiye.
She: 😂 I'm [her name].
Me: [Name]. See you at lunch!`
  },
  // Shopping/Mall (166-175)
  {
    id: 166,
    title: "Mall — Shoe Section",
    category: "Approach",
    text: `*Context: Both in the shoe section, trying on shoes*

Me: *trying on shoes* Yeh 10th pair hai aur koi bhi comfortable nahi lag raha. Mera pair hi defective hai lagta hai.
She: *laughs* Same! Sab tight hai ya bahut loose.
Me: Shoe shopping is the WORST. Dikhte hain acche, pehan-te hain toh lagta hai Cinderella ka opposite ho gaya.
She: 😂 Cinderella ka opposite!
Me: "Uglyella" — jisko koi shoe fit nahi hota.
She: 😂😂 That's me right now.
Me: Chalo dono "Uglyella" hain — support group bana lete hain.
She: "Uglyella Support Group — shoes that don't fit since 1999" 😂
Me: Waise yeh wali try ki? *picks a pair* Meri friend ne boli thi yeh brand comfortable hai.
She: Oh which one? *looks*
Me: *shows*
She: Hmm, try karti hoon.
Me: Agar fit aa gaya toh mujhe consultant fees milni chahiye.
She: 😂 Kya fees?
Me: Ek ice cream. Food court mein.
She: *tries shoes* Oh! Yeh toh accha hai!
Me: SEE! Main shoe consultant hoon — undiscovered talent!
She: 😂 Ice cream earned!
Me: I'm [name], shoe whisperer.
She: [Her name]. Food court chalo, consultant!`
  },
  {
    id: 167,
    title: "Supermarket Aisle — Same Item",
    category: "Approach",
    text: `*Context: Both reaching for the last packet of something on the shelf*

Me: *hand reaches same pack* Oh! Aap lelo, main kuch aur dhundh lunga... *checks shelf* ...jo exist nahi karta kyunki yeh last packet hai.
She: 😂 No no, aap le lo!
Me: Nahi seriously, aap pehle the. Main toh yehi tha par "excuse me" bolne ki himmat nahi thi.
She: 😂 Shy shopper?
Me: Extremely. Supermarket mein main introvert ban jaata hoon.
She: 😂 How?
Me: Staff se kuch puchna hai toh 5 minute sochta hoon "bolu ya na bolu." Phir Google karta hoon.
She: 😂😂 Overthinking in a supermarket!
Me: Haan! "Which aisle is pasta?" — yeh Google pe search karna easier hai than asking someone.
She: You need help 😂
Me: I know! Waise aap pro shopper lag rahi ho — trolley mein system hai. Mere trolley mein toh random cheezein hain.
She: 😂 Organized shopping is important!
Me: Teach me! I'm a shopping disaster.
She: List banao pehle.
Me: List?! Woh kya hota hai? Main toh "jaao aur jo dikhe le aao" gang mein hoon.
She: 😂 Toh phir bill shock bhi lagta hoga?
Me: HAR BAAR! "6000?! Maine toh sirf bread lene aaya tha!"
She: 😂😂 Classic!
Me: I'm [name], professional impulse buyer.
She: [Her name], professional list-maker. I'll reform you!`
  },
  {
    id: 168,
    title: "Electronics Store — Confused Buyer",
    category: "Approach",
    text: `*Context: Both looking at phones/laptops at an electronics store*

Me: *staring at specs* Yeh sab processors ka naam aise hain jaise aliens ne rakha hai.
She: *laughs* Snapdragon, Dimensity — sounds like Pokemon.
Me: EXACTLY! "Main choose karta hoon... SNAPDRAGON 8 GEN 3!" *throws imaginary pokeball*
She: 😂 Pikachu would be confused.
Me: Pikachu bhi confused hoga — "Bro, main ek simple mouse hoon, yeh kya processors hain?"
She: 😂 Kya lene aaye ho?
Me: Phone. Budget [amount]. Recommendation?
She: Tech person hoon — I can help! Kya use karte ho mainly?
Me: Camera, social media, aur overthinking apps... matlab notes app.
She: 😂 Overthinking apps!
Me: Haan, Notes app mein deep thoughts likhta hoon raat ko. Subah padhta hoon toh lagta hai "yeh kisne likha?"
She: 😂 Relatable!
Me: Toh kya lun guru ji?
She: *suggests phone with reasoning*
Me: Wow, salesman se better explanation! Aapko yahan kaam karna chahiye.
She: 😂 Free mein consulting de rahi hoon.
Me: Free? Atleast chai toh lene do baad mein. Expert advice ka payment.
She: Chai chalegi 😊
Me: Done! I'm [name], tech-illiterate with a new phone thanks to you.
She: [Her name]. Chai ke liye ready after shopping!`
  },
  {
    id: 169,
    title: "Furniture Store — Sofa Testing",
    category: "Approach",
    text: `*Context: Both testing sofas at a furniture store*

Me: *flopping on a sofa* Yeh sofa mein se mujhe uthne ka mann nahi kar raha. Main yahan reh sakta hoon forever.
She: *on next sofa, laughs* Main toh 3rd sofa test kar rahi hoon. Sab comfortable hain!
Me: Testing toh full dedication se karna chahiye. *lies down fully* Haan, yeh ek 9/10 hai.
She: 😂 Rating de rahe ho?
Me: Professional sofa tester hoon. Resume mein likha hai — "Tested 200+ sofas. Expert in comfort analysis."
She: 😂 Dream job!
Me: Haan, par salary nahi milti. Bas free naps milti hain showroom mein.
She: 😂 Kya le rahe ho for your place?
Me: Kuch samajh nahi aa raha. Itne options hain ki brain freeze ho gaya.
She: Same problem! L-shaped ya straight?
Me: L-shaped fancy lagta hai par mere room mein toh I-shaped bhi mushkil se fit hoga.
She: 😂 Small room?
Me: "Cozy" bolta hoon main. Real estate walon se seekha hai — small = cozy, tiny = intimate, no parking = eco-friendly.
She: 😂😂 Marketing genius!
Me: Chalo, ek kaam karte hain — dono saath mein decide karte hain. Two confused minds = one good decision hopefully.
She: Sure! Par meri budget limited hai.
Me: Same! "Limited budget, unlimited taste" — hamari tagline.
She: 😂 I'm [her name].
Me: [Name]. Sofa shopping partnership begins!`
  },
  {
    id: 170,
    title: "Pet Shop — Puppy Section",
    category: "Approach",
    text: `*Context: Both looking at puppies in a pet shop*

Me: *melting* Oh my goddd, yeh golden retriever puppy mujhe ghar le jaana hai. Life complete ho jayegi.
She: *also melting* I KNOW! Kitna cute hai!
Me: Isko dekh ke mujhe apni saari problems bhool gayi. Yeh hai asli therapy.
She: 😂 Puppy therapy is real.
Me: "Doctor, mujhe anxiety hai." "Here's a puppy. That'll be 0 rupees." CURED!
She: 😂 Best doctor ever.
Me: Aap bhi lene aayi ho ya sirf heartbreak lene — dekhne aur le nahi paane ka?
She: Dekhne aayi hoon 😅 Flat mein pets allowed nahi hai.
Me: SAME TRAGEDY! Mera landlord bolte hain "no pets" — bro, main bhi ek tarah ka stray hoon, mujhe rakh liya!
She: 😂😂 Stray tenant!
Me: Haan! "Feeds himself, mostly quiet, occasionally barks at neighbors" — basically a dog.
She: You ARE a puppy 😂
Me: Thank you? I think? Chalo, since dono le nahi sakte — weekly pet shop visit? For emotional support?
She: YES! Sunday pet shop day!
Me: Done! Aur jab dono ka flat change hoga — pehle puppy, phir furniture.
She: Priorities! 😂 I'm [her name].
Me: [Name]. See you Sunday, fellow petless soul!`
  },
  // Additional Approach templates (171-200)
  {
    id: 171,
    title: "Movie Theatre — Same Snack Counter",
    category: "Approach",
    text: `*Context: Both at the snack counter before a movie*

Me: *looking at prices* 500 ka popcorn?! Yeh popcorn hai ya gold-plated?
She: *laughs* Seriously! Bahar 50 ka milta hai.
Me: Main toh ghar se Maggi bana ke laata tha pehle. Ab security check mein pakad lete hain.
She: 😂 Maggi smuggling!
Me: "Sir, yeh kya hai bag mein?" "Yeh... protein supplement hai." "Sir yeh Maggi hai." "Masala flavor toh protein hai!"
She: 😂😂
Me: Kya movie dekh rahi ho?
She: [Movie name].
Me: SAME! Toh toh baat banti hai. Combo share karein? 500 ka popcorn 250-250 mein split.
She: Smart! 😂 Done!
Me: See? Main financially intelligent decisions leta hoon — mostly snack-related.
She: 😂 Financial advisor for snacks.
Me: "Invest in shared popcorn — 50% savings, 100% company."
She: Best investment tip ever 😂
Me: Chalo andar chalte hain. Interval mein review discuss karenge.
She: Deal!
*after movie*
Me: 10/10 ya kuch aur?
She: 8/10.
Me: 8?! Kaunsa 2 missing?!
She: Climax predictable tha.
Me: Valid. Par overall solid. I'm [name].
She: [Her name]. Next movie bhi saath mein?
Me: Popcorn split partner for life! 🍿`
  },
  {
    id: 172,
    title: "Concert — Lost in Crowd",
    category: "Approach",
    text: `*Context: Concert, she's trying to see the stage but too short*

Me: *noticing her jumping* Aap kursi chahiye? Main piggyback ride bhi de sakta hoon.
She: 😂 Kuch toh dikhna chahiye! Itne paise diye hain.
Me: Ticket ke paise + dikhta kuch nahi = India's Got Scammed.
She: 😂 True!
Me: Chalo thoda aage chalte hain — main crowd navigate karta hoon, aap peeche aao.
She: Really? Thanks!
Me: *navigates through* Excuse me... sorry... birthday hai uska... emergency... *reaches front area*
She: 😂 Birthday?! Kiska?
Me: Kisi ka nahi par log raasta de dete hain. Pro tip.
She: 😂 Life hack!
Me: Ab dekho — stage right there!
She: YES! Thank you!
*concert continues, both vibing*
Me: *during favorite song* THIS ONE! 🎵
She: SAME! *both singing along*
Me: Humari music taste match ho gayi toh ab toh permanent concert buddy banana padega!
She: 😂 Next concert kab hai?
Me: Check karta hoon — whoever it is, we're going. Front row strategy already ready hai.
She: 😂 Birthday excuse?
Me: OBVIOUSLY! I'm [name], professional crowd navigator.
She: [Her name]. Best concert ever!`
  },
  {
    id: 173,
    title: "Exhibition — Science/Tech Fair",
    category: "Approach",
    text: `*Context: Both at a tech/science exhibition, looking at a robot*

Me: *to robot* Bro, mera homework kar dega?
She: *laughs* Robot ko homework de rahe ho?
Me: Agar robot itna smart hai toh kaam toh karna chahiye. Warna "artificial intelligence" ka matlab kya?
She: 😂 Fair point.
Me: Main AI se itna kaam karwaata hoon ki mujhe darr hai mera replacement na ban jaaye.
She: 😂 AI will take our jobs wali fear?
Me: Fear nahi, acceptance. "Welcome AI overlords. Please be gentle."
She: 😂😂 Kya karti ho for work?
Me: [Work]. You?
She: [Her work].
Me: Oh nice! Toh aap bhi tech mein ho. Hum dono ka replacement ek hi robot karega.
She: 😂 Efficient replacement!
Me: "Two for one deal. Robot does both jobs. Humans: go home."
She: Dystopian but funny 😂
Me: Chalo next exhibit dekhte hain — woh VR wala try karna hai.
She: Oh haan! VR try karte hain!
Me: *after VR* That was insane! I'm [name].
She: [Her name]. Next tech event saath mein?
Me: Done! Robot army se ladenge saath mein!`
  },
  {
    id: 174,
    title: "Flight — Co-Passenger",
    category: "Approach",
    text: `*Context: Airplane, she's in the window seat, you're in the middle*

Me: Hi, middle seat mila hai mujhe — basically aviation ka punishment.
She: 😂 Window is the best, sorry!
Me: Koi nahi, middle seat wale ko ek hi right milta hai — dono armrests.
She: Dono?! 😂
Me: Haan, unwritten rule hai. Window waale ko view milta hai, aisle waale ko leg space, middle waale ko armrests. Fair distribution.
She: 😂 Maine toh kabhi nahi suna yeh rule.
Me: Kyunki yeh Middle Seat Survivors Association ka internal rule hai. Main president hoon.
She: 😂 President!
Me: Haan, founding member bhi. Akela member bhi.
She: 😂 Lonely association.
Me: Recruitment open hai — par koi join nahi karta. Koi middle seat nahi chahta.
She: 😂 Logical.
Me: Kahan ja rahi ho?
She: [City]. You?
Me: Same! Work or personal?
She: Vacation 😊
Me: Oh nice! Main bhi. Solo trip?
She: Friends ke saath.
Me: Accha! Main solo. Recommendations chahiye — kya dekhun wahan?
She: Oh I know great spots! *shares recommendations*
Me: You're a lifesaver! I'm [name].
She: [Her name]. If you need a local guide for a day, DM karna!
Me: Pakka! *mentally celebrates*`
  },
  {
    id: 175,
    title: "Society Event — Diwali Mela",
    category: "Approach",
    text: `*Context: Apartment society's Diwali mela/fair*

Me: *at game stall* Bhaiya ek aur try! *misses all targets*
She: *watching, laughing*
Me: Aap has rahi ho?! Yeh rigged hai! Targets hil rahe hain!
She: 😂 Targets nahi hil rahe, tumhara aim hil raha hai.
Me: Ouch! Par sach hai 😂 Aap try karo — agar aap bhi miss karogi toh prove hoga ki game rigged hai.
She: Challenge? Let's go! *hits 3 out of 5*
Me: ... How?!
She: Skill 😎
Me: "Skill" — right. Main toh Google karunga "how to aim at mela stalls."
She: 😂 Google se nahi hoga, practice chahiye.
Me: Practice kahan? Ghar mein targets lagaaun?
She: 😂 Imaginary targets se karo — like throwing socks in laundry basket.
Me: OH! Woh toh main daily karta hoon! Par miss bhi daily karta hoon.
She: 😂😂 Toh isliye aim weak hai — laundry practice se kuch nahi hoga!
Me: Brutal but accurate. Waise prize jeet liya toh kya logi?
She: Woh teddy bear chahiye 🧸
Me: *to bhaiya* BHAIYA EK AUR TRY! 
*misses again*
Me: Teddy bear ke liye phir aaunga. I'm [name], your terrible-aim neighbor.
She: [Her name] 😂 Kal phir try karna!`
  },
  {
    id: 176,
    title: "Swimming Pool — Beginner Lane",
    category: "Approach",
    text: `*Context: Swimming pool, both in the beginner section*

Me: *holding pool edge, scared* Main toh sirf ek baat confirm karna chahta hoon — lifeguard yahan hai na?
She: *laughs* Haan, woh baitha hai corner mein.
Me: Thank god! Mera swimming level — "can survive in bathtub."
She: 😂 Bathtub level?
Me: Haan, shower mein toh pro hoon. Pool mein newbie.
She: 😂 You'll be fine! Just float karo pehle.
Me: Float?! Meri body ka density itna hai ki main seedha doob jaata hoon.
She: 😂 Everyone can float! Relax karo body ko.
Me: "Relax" — woh word meri dictionary mein hai par pool mein apply nahi hota.
She: 😂 Come, I'll help. Hold the edge aur legs kick karo.
Me: *tries* Yeh theek hai?
She: Better! See, natural hai.
Me: Natural?! Main toh dolphin wali feeling aa rahi hai — beached dolphin.
She: 😂😂 Progress hai! 
Me: Thanks coach! Bina tumhare main abhi bhi edge pakde hua hota.
She: 😂 Regular aao, 2 weeks mein swim karoge.
Me: 2 weeks?! Olympics ka time 4 saal hai, hope hai.
She: 😂 I'm [her name].
Me: [Name]. Pool buddy ban gayi tum — kal se daily class?
She: Daily chai aur daily swim 😊`
  },
  {
    id: 177,
    title: "Rock Climbing Wall — Indoor",
    category: "Approach",
    text: `*Context: Indoor rock climbing gym, both gearing up*

Me: *looking up at the wall* Yeh wall dekh ke mujhe lag raha hai main apni life choices question kar raha hoon.
She: 😂 First time?
Me: Haan, aur possibly last — depending on whether I survive.
She: It's fun! Aur safe hai — harness hai.
Me: Harness hai par mera trust issues hai — "Kya yeh ek rope mujhe rok payegi?"
She: 😂 Engineering pe trust rakho.
Me: Engineering pe trust? Bro, main engineering student tha — I know what we did. Trust kam hi rakho.
She: 😂😂 Valid point!
Me: Par YOLO. Chalo, race? Jo pehle top pe pahunche?
She: You sure? 😏
Me: Nahi sure par ego bol raha hai "haan."
She: 😂 Let's go!
*she reaches top first, easily*
She: *from top* Oi! Kahan ho?
Me: *stuck halfway* YAHAN! Meri baazu ne resignation de di hai!
She: 😂 Thoda aur! Almost there!
Me: "Almost there" — meri life story.
She: Come on! Push!
Me: *reaches top* YES! I DID IT! *panting*
She: 😂 See! You made it!
Me: Thanks to your motivation! I'm [name], halfway-stuck champion.
She: [Her name]. Next time faster hona padega!
Me: Challenge accepted!`
  },
  {
    id: 178,
    title: "Bowling Alley — Gutter Ball King",
    category: "Approach",
    text: `*Context: Bowling alley, adjacent lanes*

Me: *throws ball, gutter* AGAIN?! 5th gutter ball! Main toh bowling nahi, gutter cleaning kar raha hoon!
She: *next lane, laughs* Technique change karo!
Me: Technique?! Meri technique hai — "pray and throw." God clearly not listening.
She: 😂 Hold the ball differently. Let me show you.
Me: You'd help a stranger fix his terrible bowling?
She: Can't watch you suffer anymore 😂
Me: *she shows grip* Like this?
She: Haan, now aim at the arrows on the lane, not the pins.
Me: *throws — knocks 7 pins* WHAT?! HOW?!
She: SEE! 😂
Me: You're a wizard! Bowling wizard!
She: 😂 Basic technique hai.
Me: Basic for you, miraculous for me! Ek aur sikhao!
She: Okay, this one's for a spare... *teaches*
Me: *gets spare* I'M A PROFESSIONAL NOW!
She: 😂 One spare doesn't make you professional.
Me: Let me have this! First spare of my LIFE!
She: 😂 Congrats!
Me: Thanks guru! I'm [name]. Match khelein saath mein?
She: Sure! Fair warning — I won't go easy.
Me: Expected nothing less! Loser buys dinner.
She: Done! 😊`
  },
  {
    id: 179,
    title: "Trekking Group — Steep Section",
    category: "Approach",
    text: `*Context: Group trek, steep section, she's struggling a bit*

Me: *offers hand* Yeh path dekhke lagta hai mountain ne personally decide kiya hai "aaj inhe nahi jaane dunga."
She: *takes hand, laughs* Seriously! Itna steep kyun hai?
Me: Kyunki easy trek pe koi nahi jaata — Instagram pe "hard trek conquered" likhna hai sabko.
She: 😂 True! Photo ke liye suffer karna padta hai.
Me: "Suffer for the gram" — new generation motto.
She: 😂 Kaunsa trek hai aapka first?
Me: First proper trek! Pehle sirf stairs ki counting karta tha. Ab toh mountain hi count kar raha hoon.
She: 😂 Stairs se mountain — big jump!
Me: Too big. Meri body ne complaint file ki hai — HR mein.
She: 😂 Body ka HR department!
Me: "Dear Management, ye trek was not in my job description. Regards, Legs."
She: 😂😂
Me: Par view ke liye worth it hoga na?
She: 100%! Top pe pahunchke sab bhool jaoge.
Me: Sab bhool jaunga? Mere legs toh yaad rakhenge.
She: 😂 Chalo, 20 minute aur!
Me: 20?! *deep breath* Okay. I'm [name], mountain newbie.
She: [Her name], trek #15 for me.
Me: 15?! Guide ban jaao meri. Fees: yeh trek safely complete karwao.
She: 😂 Free of cost. Chalo!`
  },
  {
    id: 180,
    title: "Tennis Court — Beginner Serve",
    category: "Approach",
    text: `*Context: Tennis court, you're practicing serves badly, she's on adjacent court*

Me: *ball goes over the fence for the 4th time* Sorry! SORRY!
She: *catches it, laughing* Yeh tennis hai ya baseball?
Me: At this point, I'm not sure 😂 Mera serve ka trajectory unpredictable hai — missile defense bhi track nahi kar sakti.
She: 😂 Toss aur hit — simple hai!
Me: "Simple" kehna easy hai, karna mushkil. Mere haath aur racket mein communication gap hai.
She: 😂 Want a tip?
Me: Please! Kuch bhi! Main surrender karne wala hoon.
She: Ball ko thoda higher toss karo, phir hit at the highest point.
Me: *tries* *ball actually goes over the net* DID THAT JUST HAPPEN?!
She: YAY! 😂 Good one!
Me: Main champion hoon! Ek serve aur main Federer feel kar raha hoon!
She: Federer is retired 😂
Me: Exactly — ab opening hai! I'll fill his spot.
She: 😂 With that serve? Long way to go.
Me: Coach chahiye long-term. Application accept karogi?
She: 😂 Kya milega mujhe?
Me: Post-practice smoothie + bragging rights ki tumne ek zero ko hero banaya.
She: 😂 Compelling offer. I'm [her name].
Me: [Name]. Coach-student bond starts now!`
  },
  {
    id: 181,
    title: "Gym — Cardio Zone Treadmill",
    category: "Approach",
    text: `*Context: Both on adjacent treadmills at the gym*

Me: *jogging slowly* Main soch raha hoon treadmill pe chalna life ka metaphor hai — bahut effort, kahin nahi pahunchte.
She: *laughs while running* Deep thought for a treadmill.
Me: Haan, 20 minute se chal raha hoon — literally aur philosophically — same jagah hoon.
She: 😂 Speed badha do toh kuch feel hoga.
Me: Speed badhaunga toh meri aatma nikal jayegi. Abhi 4 pe chal raha hoon — safe zone.
She: Main 8 pe hoon 😂
Me: 8?! Aap sprinting ho, main strolling! Humari treadmills mein class divide hai.
She: 😂 Class divide on treadmill — sociology project!
Me: Paper likh dete hain — "Economic inequality reflected in gym speed settings."
She: A+ paper 😂
Me: Waise roz aati ho?
She: 5 days a week.
Me: Dedication! Main "whenever guilt hits" basis pe aata hoon.
She: 😂 Guilt-driven fitness!
Me: Haan, pizza khaata hoon Friday, Saturday guilt, Sunday gym. Cycle of life.
She: 😂 At least you come!
Me: True. I'm [name], slowest treadmill user in this gym.
She: [Her name]. Kal speed 5 pe chalana — progress!
Me: 5?! Baby steps... literally. Deal!`
  },
  {
    id: 182,
    title: "Football Turf — Pickup Game",
    category: "Approach",
    text: `*Context: Football turf, teams being formed, she's in the other team*

Me: *before game* Just so you know, meri football skill = 0. Main sirf running karta hoon, ball ko chhuna optional hai.
She: 😂 Toh tum kya karte ho field pe?
Me: Moral support! "SHOOT SHOOT!" bolna bhi contribution hai.
She: 😂 Cheerleader football player!
Me: Best role! No pressure, full credit if team wins.
She: And if team loses?
Me: "Main nahi tha ball ke paas" — perfect alibi.
She: 😂 Clever!
*during game, she scores*
Me: *from midfield* GOAAAL! Oh wait, woh toh opponent team ka tha.
She: *celebrating* Sorry not sorry! 😂
Me: Respect! Woh shot was amazing though. Mujhe sikhao woh curve.
She: After the game!
*after game*
She: So curve shot — inside of the foot, hit the side of the ball...
Me: *tries, ball goes sideways*
She: 😂 Thoda aur practice!
Me: Ek din main Messi banunga. Ek din.
She: Messi bhi practice se bana!
Me: True. I'm [name], future Messi (in my dreams).
She: [Her name]. Weekly game hai, aana!
Me: I'll be there — cheerleading aur learning both!`
  },
  {
    id: 183,
    title: "Skating Rink — Can't Stand",
    category: "Approach",
    text: `*Context: Ice/roller skating rink, you can barely stand*

Me: *holding railing for dear life* Main kyu aaya yahan? Kisne bola tha yeh fun hai?
She: *skating past smoothly* Fun toh hai! 😂
Me: Fun?! Mere paair keh rahe hain "bhai, hum flat surface ke liye bane hain!"
She: 😂 Railing chhodo, balance aayega.
Me: Railing chhodna = hospital jaana. Main risk nahi le sakta.
She: Come on! Haath do, main pakad ke le jaati hoon.
Me: Pakka? Promise girne nahi dogi?
She: Promise! *holds hand*
Me: *slowly moves* Oh... OH! MAIN CHAL RAHA HOON!
She: See! 😂 Easy hai!
Me: Easy?! Mera heart rate 200 hai abhi!
She: 😂 Breathe!
Me: Breathing bhi bhool gaya tha. Multi-tasking nahi hota — skating + breathing + not dying.
She: 😂😂 You're doing great!
Me: *does one full round* I DID IT! GOLD MEDAL!
She: 😂 Bronze at best.
Me: Brutal! Par accepted. I'm [name], skating catastrophe turned survivor.
She: [Her name]. Next time without railing!
Me: Baby steps! Next time sirf ek haath railing pe. Progress!
She: 😂 Deal!`
  },
  {
    id: 184,
    title: "Basketball Court — Air Ball",
    category: "Approach",
    text: `*Context: Basketball court, you shoot and miss everything — air ball*

Me: *shoots, misses everything* That didn't happen. Nobody saw that.
She: *from the bench, laughing* I saw it 😂
Me: Then I need to eliminate the witness.
She: 😂 Aggressive!
Me: Nahi nahi, witness ko bribe karunga — chai se. Less aggressive.
She: Chai se toh kuch nahi dekha maine 😂
Me: See? Corruption works! Aap bhi khelti ho?
She: Haan, thoda bahut.
Me: "Thoda bahut" — yeh sab pro log bolte hain. Aao, 1v1?
She: Sure! Par tumhara air ball dekhke confidence aa gaya hai mujhe.
Me: 😂 Valid! Main deliberately easy opponent hoon.
*they play, she wins easily*
Me: Okay so "thoda bahut" was a lie.
She: 😂 Surprise!
Me: Main toh opponent nahi, practice dummy tha.
She: 😂 You have potential though!
Me: "Potential" — teachers bhi yehi bolte the. "Beta, potential hai par use nahi karta."
She: 😂 Use karo ab! Weekly game?
Me: Weekly? Deal! Ek din main dunk marunga.
She: Pehle layup seekho 😂
Me: Fair. I'm [name], basketball potential-wala.
She: [Her name]. Coach mode on from next week!`
  },
  {
    id: 185,
    title: "Cycling Group Ride — Can't Keep Up",
    category: "Approach",
    text: `*Context: Group cycling ride, you're at the back, she slows down for you*

Me: *dying* Aap... aap kyun... slow ho gayi? Group aage... nikal gaya.
She: 😂 Tumhe akela nahi chhod sakti! Peeche se koi nahi aayega.
Me: Main toh... soch raha tha... Uber book kar loon... cycle wahi chhod ke.
She: 😂 Don't give up! 2 km aur hai.
Me: 2 KM?! Abhi toh 1 km mein meri zindagi flashback chal rahi thi.
She: 😂 Dheere karo, rush mat karo.
Me: Dheere toh chal raha hoon — itnaa dheere ki cycle bhi bol rahi hai "bhai, pedal maar."
She: 😂 Cycle baat karti hai tumse?
Me: Haan, relationship hai hamari — toxic, par hai.
She: 😂😂 Chalo, race nahi hai, enjoy karo view.
Me: View accha hai actually. *looks around* Haan, yeh worth it hai.
She: See! Nature ka asli feel cycling mein aata hai.
Me: Nature feel aa rahi hai, legs ka feel ja raha hai.
She: 😂 Almost there! 
*finish line*
Me: MADE IT! *collapses on grass*
She: 😂 Alive ho?
Me: Barely! I'm [name], cycling group ka last finisher.
She: [Her name]. Next ride mein pehle finish karoge!
Me: Pehle survive karna hai, phir finish ki baat karenge.`
  },
  {
    id: 186,
    title: "Sports Shop — Jersey Selection",
    category: "Approach",
    text: `*Context: Both at a sports shop looking at football/cricket jerseys*

Me: *holding two jerseys* Yeh wali ya woh wali — yeh decision mujhe 30 minute se pareshan kar raha hai.
She: *browsing nearby* Kaunsi team?
Me: [Team name]. Aap?
She: [Rival team]!
Me: OH NO. Rival fan! Yeh toh Romeo-Juliet situation hai — sports edition.
She: 😂 Sports mein rivalry zaroori hai!
Me: Zaroori hai par abhi toh peaceful shopping ho rahi thi. Ab toh trash talk karni padegi.
She: Bring it! 😂
Me: Last season yaad hai? [reference to rival team's loss]
She: 😤 Woh referee biased tha!
Me: "Referee biased tha" — har haarne wali team ka national anthem hai!
She: 😂 Rude! Par funny.
Me: See? Rivalry mein bhi fun hai. Waise yeh wali ya woh wali? Seriously batao.
She: *looks* Hmm, yeh wali. Color suits you.
Me: Enemy team ki fan ne mujhe fashion advice di. World is healing.
She: 😂 Fashion has no rivalry.
Me: Deep! I'm [name], proud [team] fan.
She: [Her name], prouder [rival team] fan!
Me: Next match saath dekhenge? Trash talk live mein zyada fun hai!
She: 😂 You're on!`
  },
  {
    id: 187,
    title: "Yoga Retreat — Morning Session",
    category: "Approach",
    text: `*Context: Weekend yoga retreat, morning meditation session*

Me: *opens one eye during meditation* Psst, tum bhi bored ho ya sirf main?
She: *opens eye, giggles* Shh! Instructor dekhegi!
Me: *whispers* "Clear your mind" bol rahi hai — bro, mera mind 47 tabs open hai, clear kaise karun?
She: *trying not to laugh* 😂 Focus karo!
Me: Main focus kar raha hoon — tumse baat karne pe.
She: 😂 That's not the point!
*after session*
Me: So... enlightenment aaya?
She: Not yet 😂 You?
Me: Mujhe toh sirf back pain aaya. Cross-legged 30 minute — meri legs ne union meeting bula li.
She: 😂 Flexibility badhega time ke saath.
Me: Time ke saath? Mujhe toh ab chahiye! Amazon se order nahi hoti flexibility?
She: 😂 Next day delivery mein nahi aati.
Me: Sad. Waise aap pehli baar aayi ho retreat pe?
She: 3rd time. It's peaceful.
Me: Peaceful toh hai — jab tak main bakwaas nahi karta.
She: 😂 Tumhari bakwaas bhi entertaining hai.
Me: Best review! I'm [name], yoga dropout potential.
She: [Her name]. Dropout mat bano, kal ka session accha hoga!
Me: Kal bhi aankh kholke tumse baat karunga meditation mein 😂
She: 😂 Main aankh band rakhungi!`
  },
  {
    id: 188,
    title: "Gym — Weights Section Confusion",
    category: "Approach",
    text: `*Context: Gym weights section, you're looking at machines confused*

Me: *staring at a machine* Yeh kaise use karte hain? Isme baithun ya lete jaun? Ya isse hi uthaaun?
She: *laughing from nearby* Woh chest press hai — baithke push karo.
Me: Push?! Mujhe toh pull karna tha. No wonder kuch nahi ho raha tha!
She: 😂 Gym mein pehle koi sikhata nahi kya?
Me: Trainer ka slot book kiya tha — woh bhi nahi aaya. Ghosted by a trainer — new low.
She: 😂 I can show you basics if you want.
Me: Aap trainer ho?
She: Nahi, par 2 saal se aa rahi hoon. Basics pata hain.
Me: "Basics pata hain" — mujhe toh woh bhi nahi. Please teach!
She: *shows correct form* See? Yeh chest, yeh back, yeh legs.
Me: Oh! Yeh toh sense bana raha hai. Kal tak main sab galat kar raha tha — no wonder body same hai!
She: 😂 Form important hai.
Me: Form toh hai hi nahi mera — na gym mein na life mein.
She: 😂 Gym mein toh fix kar sakte hain!
Me: I'm [name], gym ka most confused member.
She: [Her name]. Kal se proper routine banate hain.
Me: Routine?! Mere life mein pehli baar! Let's go!`
  },
  {
    id: 189,
    title: "Park — Flying Kite / Makar Sankranti",
    category: "Approach",
    text: `*Context: Park/terrace, Makar Sankranti, flying kites*

Me: *kite immediately crashes* KAT GAYA! 5th baar! Meri patang se zyada toh paise ud rahe hain.
She: *flying her kite smoothly, laughing* Dheel do thoda!
Me: Dheel?! Kaise?! Mujhe toh dheel ka concept samajh nahi aata — life mein bhi nahi, patang mein bhi nahi.
She: 😂 Deep! Yeh lo, main batati hoon.
Me: *she helps guide his kite* Oh... OH! UD RAHI HAI!
She: See! 😂 Bas balance rakho.
Me: BALANCE! Meri patang ud rahi hai! Achievement unlocked!
She: 😂 Ab kisi ki kaato!
Me: Kaatun?! Abhi toh udna seekha, battle kaise?
She: Simple — unki patang ke paas le jaao aur string cross karo. Pull karo jaldi.
Me: *tries, his own kite crashes again*
Me: ... Main peacekeeper type hoon, battle mera nahi.
She: 😂😂 Koi nahi, udate raho pehle.
Me: Aap pro ho! Kitne kaati aaj?
She: 7 😎
Me: 7?! Warrior ho! Main toh 0 kataa aur 5 khoya.
She: 😂 Negative score!
Me: I'm [name], patang ka worst player.
She: [Her name], patang champion! Next Sankranti pe phir sikhaungi.
Me: Done! Tab tak practice karunga... YouTube pe.
She: 😂 YouTube se patang nahi aaegi! Terrace pe aao!`
  },
  {
    id: 190,
    title: "Laundromat — Waiting for Clothes",
    category: "Approach",
    text: `*Context: Both at a laundromat/laundry service waiting*

Me: *staring at washing machine* Yeh watching clothes spin = free entertainment. Netflix se zyada interesting.
She: 😂 Hypnotizing hai actually.
Me: Main toh 20 minute se dekh raha hoon — meri productivity zero hai par peace infinite.
She: 😂 Laundry meditation.
Me: "Laundry meditation — watch your clothes go round like your life" — motivational poster material.
She: Dark 😂
Me: Dark but relatable! Waise aap bhi apne kapde khud dhoye ho? Or hostel life?
She: PG life 😂 Washing machine nahi hai.
Me: Same energy! Mera bhi PG — "Kapde? Haath se dho ya bahar jao." Main bahar aaya.
She: Outsourcing 😂
Me: Smart outsourcing! "Why do it yourself when you can pay 50 rupees?"
She: Life hack.
Me: Waise kitna time lagta hai?
She: 30 min wash, 20 min dry.
Me: 50 minute! Perfect chai time. Saamne tapri hai — chalein?
She: Haan! Waise bhi bore ho rahi thi.
Me: Bore? Tumne toh abhi bola hypnotizing hai!
She: 😂 2 minute ke liye. Uske baad boring.
Me: Fair! I'm [name], laundry buddy.
She: [Her name]. Weekly laundry meetup?
Me: Same day, same machine, same boredom. Done!`
  },
  {
    id: 191,
    title: "Hospital/Clinic — Waiting Room",
    category: "Approach",
    text: `*Context: Both waiting at a clinic/hospital, bored*

Me: *fidgeting* Yeh waiting room mein magazines 2015 ki hain. Kya main time travel kar gaya?
She: *laughs* Haan, "Filmfare 2015 — Deepika ki new movie!"
Me: "New movie" jo 10 saal pehle aayi. Time yahan ruk gaya hai.
She: 😂 Doctors ka waiting time hi asal test hai.
Me: "Doctor will see you in 5 minutes" — yeh 5 minutes hain ya 5 geological eras?
She: 😂 Geological time!
Me: Main toh sochta hoon ki waiting room mein WiFi achha hona chahiye — at least boredom toh solve hoga.
She: No WiFi is a crime in 2025.
Me: Petition sign karwaani chahiye — "WiFi in waiting rooms — a fundamental right."
She: 😂 I'll sign!
Me: First signatory! I'm [name], founder of the WiFi Rights Movement.
She: [Her name], co-founder!
Me: NGO ban gayegi humari. "Humans for WiFi — because buffering kills."
She: 😂 Mission statement sorted.
Me: Waise kya hua? Routine checkup?
She: Haan, boring checkup.
Me: Same! Doctor bolega "sab normal hai, exercise karo." Main bolunga "haan" aur pizza order karunga ghar jaake.
She: 😂 Doctor ki advice ka shelf life = clinic se ghar tak.
Me: Exactly! After that — back to normal chaos.
She: True 😂`
  },
  {
    id: 192,
    title: "Photo Studio — Passport Photos",
    category: "Approach",
    text: `*Context: Both at a photo studio for passport/ID photos*

Me: *just got photos* Bhaiya, yeh main hoon ya mera ghost? Kya kiya hai yeh?
She: *waiting for hers, laughing* Passport photos always look like mugshots.
Me: MUGSHOTS! Exactly! Aise lag raha hai main 3 countries se banned hoon.
She: 😂 Everyone looks criminal in passport photos.
Me: Immigration officer dekhega toh bolega "Sir, aap woh passport wale ho ya koi aur?"
She: 😂 Identity crisis at the airport!
Me: Waise aapka bhi aisa aata hai?
She: Haan! Main toh mirror mein normal dikhti hoon, passport photo mein alien.
Me: "Alien" — exactly the vibe. Unidentified human object.
She: 😂 UHO!
Me: Government should allow filters on passport photos. "Valencia" laga do — sab acche lagenge.
She: Immigration reject kar dega 😂
Me: Worth the risk! At least photo toh acchi hogi.
She: True 😂
*her photos come out*
She: *looks at them* Ughhh.
Me: Dikhao... oh come on, yeh toh accha hai!
She: Accha kahan?!
Me: Mera dekho — *shows his* See? Perspective matters.
She: 😂😂 Okay yours is worse.
Me: Thank you for validating my suffering. I'm [name].
She: [Her name]. Worst photo day!`
  },
  {
    id: 193,
    title: "Bank Queue — Long Wait",
    category: "Approach",
    text: `*Context: Both in a long bank queue*

Me: Token number 47. Current serving: 12. Main retire ho jaunga yahan baithe baithe.
She: *laughs* Mera 52.
Me: 52?! Tum toh mujhse 5 aur zyada suffer karogi. My condolences.
She: 😂 Thank you for your sympathy.
Me: Bank mein aana = "adventure sport" hona chahiye. Extreme patience required.
She: Certificate milna chahiye — "Survived a bank visit. 4 hours."
Me: Resume mein daalna chahiye — "Can handle bank queues. Exceptional patience."
She: 😂 Instant hire!
Me: "What's your greatest strength?" "Sir, main bank queue mein 4 ghante baitha hoon bina complaint kiye." "You're hired!"
She: 😂😂 If only!
Me: Waise UPI se nahi ho sakta tha kaam?
She: Locker kholna hai 😅
Me: Locker! Kya rakh rahi ho? Gold? Diamonds? Government secrets?
She: 😂 Documents!
Me: Boring! Main sochta tha kuch exciting hoga.
She: Sorry to disappoint 😂
Me: Koi nahi. I'm [name], bank queue survivor #47.
She: [Her name], survivor #52.
Me: Chai leke aata hoon pados se? Itna wait toh chai ke saath karna chahiye.
She: Please! Mujhe bhi lao.
Me: 2 chai incoming!`
  },
  {
    id: 194,
    title: "Grocery Store — Vegetable Section",
    category: "Approach",
    text: `*Context: Both picking vegetables, you're clearly confused*

Me: *holding two tomatoes* Yeh accha hai ya yeh? Main fresh aur not-fresh mein difference nahi bata paata.
She: *laughs* Firm wala lo, soft toh kharab ho raha hai.
Me: Firm? *squeezes tomato* Yeh firm hai?
She: Gently! Itna squeeze mat karo, tomato hai, stress ball nahi!
Me: 😂 Sorry! Main mummy ke bina grocery kharidne aaya hoon first time. Disaster ho raha hai.
She: First time?! What have you been doing all your life?
Me: Mummy bhejti thi list ke saath aur main bol-ta tha "jo bhi do" dukan wale ko.
She: 😂 "Jo bhi do" — ultimate grocery strategy.
Me: Haan par aaj mummy ne bola "khud ja, seekh" — toh yahan hoon, clueless.
She: Chalo main help karti hoon. Kya kya chahiye?
Me: *shows list* Yeh sab.
She: Oh easy! Chalo section by section.
Me: You're saving my life AND my dinner!
She: 😂 Dinner kya bana rahe ho?
Me: Sochta hoon Maggi. Usse zyada complicated nahi bana sakta.
She: 😂 Maggi ke liye yeh sab vegetables?!
Me: Mummy ne bola sabzi lao, maine nahi poocha kyun.
She: 😂😂 I'm [her name].
Me: [Name]. Grocery guru mil gayi!
She: Kal se apna list khud banana — Google karo recipes!
Me: Google karunga, promise. Par emergency mein phone karun toh chalega?
She: 😂 Emergency grocery calls? Fine!`
  },
  {
    id: 195,
    title: "Photocopy Shop — College",
    category: "Approach",
    text: `*Context: College photocopy shop, both waiting for copies*

Me: Bhaiya kitna time aur? Mera exam kal hai aur notes abhi tak print nahi hue.
She: Same! 😂 Last minute printing gang.
Me: "Last minute" nahi — "strategically timed." Pehle print karte toh padhte nahi.
She: 😂 Logic hai isme.
Me: Full logic! Ab print hoga toh raat ko padhenge, subah exam denge, result... pray karenge.
She: Same strategy 😂 Kaunsa exam?
Me: [Subject].
She: Oh same! Notes share karein?
Me: SHARE?! Tum angel ho! Mere notes mein toh sirf question marks hain — literally "???" likha hai.
She: 😂 Class mein kya karte ho?
Me: Present hoon — physically. Mentally toh main Goa mein hoon.
She: 😂 Mental vacation during lectures!
Me: Best vacation — free hai, daily milti hai, aur professor ko pata bhi nahi chalta.
She: 😂 Until viva.
Me: Viva mein toh main "Sir, bahut interesting topic hai, aap batayiye aur" karke nikal jaata hoon.
She: 😂 UNO reverse on professor!
Me: Works 50% of the time. I'm [name].
She: [Her name]. Notes bhej rahi hoon WhatsApp pe.
Me: Life saver! Exam ke baad treat pakka.
She: Pass ho jaao pehle 😂
Me: Ouch! But fair.`
  },
  {
    id: 196,
    title: "Music Store — Guitar Section",
    category: "Approach",
    text: `*Context: Music store, she's trying a guitar*

Me: *listening* Woh chord accha tha! Main toh 6 months se G chord pe atka hoon.
She: 😂 G chord basic hai!
Me: "Basic" kehti ho par meri ungliyan cooperation nahi deti. Unka apna agenda hai.
She: 😂 Practice, that's all.
Me: Practice karta hoon par fingers bol-ti hain "aaj nahi, kal dekhte hain."
She: 😂 Lazy fingers!
Me: Haan! Bahut entitled hain. "We demand better working hours. No more Bm chord."
She: Bm toh hard hai 😂
Me: Bm sun ke meri fingers ne resignation threat diya tha.
She: 😂 Kaunsa guitar hai tumhara?
Me: [Guitar type]. Basic beginner wala.
She: Oh nice! Beginners ke liye perfect.
Me: Perfect toh hai, player perfect nahi 😂 Koi recommend karogi songs for beginners?
She: "Tera Ban Jaunga" — easy chords, sounds impressive.
Me: DONE! Usse seekh ke aaunga. Phir review dogi?
She: Sure! Private concert 😂
Me: "Private concert" — fancy bol diya par ek chord bajaaunga bas.
She: 😂 One chord concert!
Me: I'm [name], one-chord wonder.
She: [Her name]. Practice karo, phir concert!`
  },
  {
    id: 197,
    title: "Stationery Shop — Pen Collection",
    category: "Approach",
    text: `*Context: Both at a stationery shop, she's picking colorful pens*

Me: *watching her select 20 pens* Exam ki taiyari hai ya rainbow bana rahi ho?
She: 😂 Color-coded notes banati hoon!
Me: Color-coded?! Main toh ek blue pen se sab kaam chala leta hoon. Maximum effort: different pressure for headings.
She: 😂 Different pressure?! That's your highlighting?
Me: Haan! Hard press = heading. Soft press = content. Genius system hai.
She: 😂 Most basic system ever.
Me: Par effective! Aur sasta! Ek pen = entire semester.
She: Ek pen semester bhar?!
Me: Budget constraint breeds innovation.
She: 😂 Innovation ya laziness?
Me: Innovation disguised as laziness — story of my life.
She: 😂 Toh yeh sab colors try karo — life change ho jayegi.
Me: Life change pen se? Yeh toh pen company ki marketing hai.
She: 😂 Try toh karo!
Me: Okay ek try. *picks a green pen* Yeh se kya karun?
She: Definitions green se likho. Brain yaad rakhta hai colors differently.
Me: Science hai isme?! I'm sold. I'm [name], newly converted color-coder.
She: [Her name]. Welcome to the colorful side!
Me: Meri boring blue pen life khatam. Naya chapter — literally!`
  },
  {
    id: 198,
    title: "Terrace — Stargazing",
    category: "Approach",
    text: `*Context: Both on the terrace of their building at night*

Me: *looking up* Woh star dekha? Woh mera hai. Maine claim kar liya.
She: *laughs* Star claim karne ka kya procedure hai?
Me: Simple — pehle dekho, phir bolo "mera hai." First come, first serve.
She: 😂 Toh woh bright wala mera!
Me: Done! Ab humari apni apni stars hain. Space mein real estate — Elon Musk eat your heart out.
She: 😂 Elon bhi nahi kar paaya yeh.
Me: Exactly! Hum usse aage hain. Waise terrace pe aksar aati ho?
She: Haan, jab neend nahi aati.
Me: Same! Insomnia support group — terrace chapter.
She: 😂 Late night thoughts?
Me: Late night thoughts — "Why do we park in driveways and drive on parkways?" type.
She: 😂 Philosophy at 1 AM!
Me: 1 AM ke baad brain ka IQ either 200 hota hai ya 2. No in-between.
She: Mere saath toh 2 wala hota hai 😂
Me: Same! Kal subah padhunga jo aaj socha — kuch samajh nahi aayega.
She: Relatable!
Me: Chalo, since dono pagal hain raat ko — terrace buddy?
She: Deal! I'm [her name].
Me: [Name]. Kal same time? Stars check karne aayein ki kahin chori toh nahi hui humari.
She: 😂 Star security check! Done!`
  },
  {
    id: 199,
    title: "Car Wash — Waiting Area",
    category: "Approach",
    text: `*Context: Both waiting at a car wash for their vehicles*

Me: *watching car get washed* Meri car itni gandi thi ki car wash wale ne pehle mujhe judge kiya, phir car ko.
She: 😂 How dirty was it?
Me: Itni ki uske upar "wash me" kisi ne likh diya tha — with their finger.
She: 😂😂 Classic!
Me: Main ignore karta raha 2 weeks — phir "wash me please" ho gaya. Jab "WASH ME OR I'LL TELL YOUR MOM" likha toh aana pada.
She: 😂 Mom threat works!
Me: Always! Mummy ka naam lo — instant action.
She: True for everyone 😂
Me: Waise aapki car toh clean dikh rahi thi already.
She: Bahar se, andar chaos hai.
Me: Andar chaos?! Like life?
She: 😂 Exactly like life — organized outside, mess inside.
Me: Deep metaphor from a car wash. I love it.
She: 😂 Philosopher ban jaate hain log waiting mein.
Me: Haan, waiting does that. ATM pe bhi philosophy aati hai, bank mein bhi, car wash mein bhi.
She: Har jagah philosopher 😂
Me: "Waiting Room Philosopher" — LinkedIn pe title rakhna chahiye.
She: 😂 Unique title!
Me: I'm [name], car wash philosopher.
She: [Her name]. Drive carefully, clean car ke saath!
Me: Clean car = new personality! See you around, neighbor!`
  },
  {
    id: 200,
    title: "RWA Meeting — Society",
    category: "Approach",
    text: `*Context: Apartment society RWA meeting, both bored*

Me: *whispering* Uncle ji parking ke baare mein 20 minute se bol rahe hain. Mujhe lagta hai unki car ki jagah unka ego park nahi ho raha.
She: *trying not to laugh* 😂 Shh! Pakde jayenge!
Me: Pakde jayenge toh kya — maximum penalty kya hai? "Beta, next meeting mein bhi aana padega." NOOOO!
She: 😂 That IS the worst punishment.
Me: RWA meeting = "how to waste a Sunday evening 101."
She: Mujhe mummy ne bheja hai. Representation chahiye family ki.
Me: Same! "Beta, society mein jaao, kuch contribute karo." Main contribute kya karunga — memes?
She: 😂 Meme officer of the society.
Me: Best designation! "Chief Meme Officer — responsible for keeping meetings entertaining."
She: Nobody would complain about long meetings then 😂
Me: Exactly! Yeh parking discussion boring hai — main ek meme banata hoon iske upar.
She: Dikhana mujhe!
Me: *shows phone with quick meme* How's this?
She: 😂😂 PERFECT! Send karo group mein.
Me: Meeting ke baad. Nahi toh uncle ji mujhe hi park kar denge.
She: 😂 I'm [her name].
Me: [Name]. RWA suffering partner!
She: Next meeting bhi saath mein — at least entertainment toh rahega!
Me: Done! Main memes ready rakh ke aaunga!\`
  },
  {
    id: 221,
    title: "Mandir — Shoe Rack Confusion",
    category: "Approach",
    text: \`*Context: You both reach for the same shoe slot at a crowded mandir...*

Me: Excuse me, yeh slot mera hai — maine advance booking ki thi.
She: 😄 What? Shoes ke liye bhi booking?
Me: Haan, IRCTC pe. Waiting list mein tha — ab confirm hua.
She: 😂 Toh meri chappal ka PNR kya hoga?
Me: Aapki chappal ko RAC milega — ek slot mein adjust kar lenge.
She: 😂😂 Itna competition shoes rakhne mein!
Me: Mandir ke bahar ki competition mandir ke andar se zyada tough hai.
She: True! Last time meri sandal gayab ho gayi thi.
Me: Isliye main ab shoes pe GPS lagata hoon.
She: 😂 Smart! Main bhi lagaungi ab se.
Me: Chalo darshan ke baad ek chai pe baat karte hain — shoes safety tips share karunga.
She: 😂 Done! Chai pe shoes ka gyaan — unique combo!
Me: [Name] btw. Shoe Security Consultant.
She: 😂 I'm [her name]. Client number 1!\`
  },
  {
    id: 222,
    title: "Mandir — Donation Box Queue",
    category: "Approach",
    text: \`*Context: Long queue at the donation box, she's standing ahead...*

Me: Excuse me, yeh donation box hai ya ATM? Queue dekh ke confuse ho gaya.
She: 😄 ATM hota toh paisa milta, yahan toh dena padta hai.
Me: Matlab reverse ATM — genius concept! Mandir wale fintech mein aa gaye.
She: 😂 Haan, UPI bhi accept karte hain ab.
Me: Main toh Google Pay se donate karunga — cashback bhi milega shayad.
She: 😂 Bhagwaan se cashback — next level faith!
Me: Dekho, agar intention sahi hai toh bhagwaan 10x return dete hain. Best ROI.
She: 😂😂 CA ho kya?
Me: Nahi, par bhagwaan ke saath mera account strong hai.
She: 😂 Mera bhi strong kara do!
Me: Chalo saath mein prarthna karte hain — group discount milega.
She: 😂 I'm [her name].
Me: [Name]. Spiritual Investment Advisor!\`
  },
  {
    id: 223,
    title: "Mandir — Coconut Breaking Fail",
    category: "Approach",
    text: \`*Context: She tries to break a coconut at mandir and it bounces off...*

Me: *picking up the coconut* Yeh nariyal bhi tough hai — respect karo iske determination ki.
She: 😂 Main itni weak hoon ya coconut itna strong?
Me: Coconut strong hai — Olympic level stamina hai isme.
She: 😂 Help kar do please!
Me: *breaks it perfectly* Main coconut breaking mein PhD kar raha hoon.
She: 😂😂 PhD! Kaunsi university?
Me: Mandir University — campus yahi hai, professor bhagwaan hain.
She: 😂 Admission open hai?
Me: Haan, par entrance exam mein ek nariyal todna padta hai.
She: 😂 Toh main fail ho gayi!
Me: Koi nahi, re-exam de do. Main tutor ban jaata hoon — free coaching.
She: 😂 Deal! I'm [her name].
Me: [Name]. Professor of Coconut Sciences!\`
  },
  {
    id: 224,
    title: "Mandir — Rangoli Near Mandir",
    category: "Approach",
    text: \`*Context: She's admiring a rangoli near the mandir entrance...*

Me: *standing next to her* Yeh rangoli dekh ke mujhe meri drawing skills ki yaad aa gayi.
She: Achhi hain kya tumhari?
Me: Itni achhi ki art teacher ne bola tha "beta, science le lo."
She: 😂😂 Itna bura?
Me: Meri drawing mein lion aur dog same dikhte the. Versatile artist hoon main.
She: 😂 Creative way to see it!
Me: Par yeh rangoli genuinely beautiful hai. Tumne banaya hai kya?
She: Nahi nahi, mandir waalon ne banaya!
Me: Achha! Par tumhare paas artistic eye hai — photography karti ho?
She: Haan thoda thoda!
Me: Nice! Ek photo le lo iska — aur ek meri bhi le lo, rangoli ke saath.
She: 😂 Okay sure!
Me: [Name] btw. Non-artist but great model.
She: 😂 I'm [her name]. Photographer ban gayi ab!\`
  },
  {
    id: 225,
    title: "Mandir — Bell Ringing Turn",
    category: "Approach",
    text: \`*Context: You both reach for the temple bell at the same time...*

Me: Ladies first — par bell itni loud hai ki puri colony jaag jayegi.
She: 😂 Haan, last time maine bajaayi toh uncle ne ghoor ke dekha.
Me: Uncle ko lagta hai bell sirf unke liye hai — reserved bell.
She: 😂 VIP bell service!
Me: Main toh soft touch karta hoon — gentle bell ringing. Premium service.
She: 😂 Premium bell ringer — LinkedIn pe daal do yeh skill.
Me: "Experienced Bell Ringer | 15+ years | Specialization: Temple Bells"
She: 😂😂 Endorsements: Bhagwaan ji, Pandit ji, Uncle ji
Me: Exactly! Recommendation letter bhi hai bhagwaan se.
She: 😂 Strong profile!
Me: Darshan ke baad chai? Bell ringing tips share karunga.
She: 😂 Done! I'm [her name].
Me: [Name]. India's #1 Bell Consultant!\`
  },
  {
    id: 226,
    title: "Mandir — Flower Garland Stall",
    category: "Approach",
    text: \`*Context: Both looking at flower garlands at the stall outside mandir...*

Me: Bhaiya, yeh maala kitne ki hai? *to her* Aur aapko kaunsi chahiye?
She: Mujhe woh yellow waali achhi lag rahi hai.
Me: Nice choice! Yellow = positivity. Main toh confused hoon — red ya orange.
She: Orange lo — Bhagwaan ko pasand aayega.
Me: Aap bhagwaan ki preference jaanti ho? Inside connection hai kya?
She: 😂 Haan, direct line hai!
Me: Toh meri ek request forward kar do — next exam pass karwa do.
She: 😂 Request accepted — processing time 7-10 business days.
Me: 😂 Bhagwaan bhi government office jaisa kaam karte hain?
She: 😂😂 Arey nahi, express delivery hoga!
Me: Pakka? Chalo phir aapka number de do — confirmation message aa jayega.
She: 😂 Smooth! I'm [her name].
Me: [Name]. Devotional Services Customer!\`
  },
  {
    id: 227,
    title: "Mandir — Parking Chaos",
    category: "Approach",
    text: \`*Context: Mandir parking is full, you both are looking for spots...*

Me: Yeh mandir ka parking hai ya musical chairs? Koi jagah nahi mil rahi.
She: 😂 Same! Main 10 minute se round laga rahi hoon.
Me: Bhagwaan darshan se pehle patience test le rahe hain — parking round 1.
She: 😂 Haan, round 2 mein line mein khade hona!
Me: Round 3 — prasad ke liye dhakka-mukki. Full obstacle course.
She: 😂😂 Mandir ya Khatron Ke Khiladi?
Me: Host — Pandit Rohit Shetty!
She: 😂 Stunt: Nariyal todna blindfolded!
Me: 😂 Woh toh main kar sakta hoon. Aapka stunt: 10 minute mein parking dhundho.
She: 😂 Impossible stunt! Main haar gayi.
Me: Chalo meri car ke paas jagah hai — adjust kar lenge. Baad mein chai?
She: 😂 Deal! I'm [her name].
Me: [Name]. Parking Stunt Coordinator!\`
  },
  {
    id: 228,
    title: "Mandir — Prasad Plate Sharing",
    category: "Approach",
    text: \`*Context: Prasad distribution, she drops her plate and you catch it...*

Me: *catches plate* Cricket mein select nahi hua toh kya — catch practice yahin ho rahi hai!
She: 😂 Thank you! Almost gir jaata.
Me: Prasad girta toh bhagwaan naraz ho jaate — maine unka mood bacha liya.
She: 😂 Hero of the day!
Me: Bas cape nahi pehni — nahi toh full superhero look hota.
She: 😂 Prasad-Man!
Me: Origin story: "Ek din mandir mein ek plate gir rahi thi..."
She: 😂😂 Marvel ko pitch karo yeh idea!
Me: MCU — Mandir Cinematic Universe.
She: 😂 First movie: Prasad Wars — Infinity Ladoo!
Me: 😂 Sequel: Endgame mein sab milke aarti karte hain!
She: 😂 I'd watch that! I'm [her name].
Me: [Name]. Director, MCU!\`
  },
  {
    id: 229,
    title: "Mandir — Steps Resting",
    category: "Approach",
    text: \`*Context: Both resting on mandir steps after climbing up...*

Me: *sits down heavily* Yeh mandir ki seedhiyan hai ya Everest base camp?
She: 😂 Same feeling! Legs are dead.
Me: Bhagwaan ne test liya — "kitni shraddha hai? 200 steps chadh ke dikhao."
She: 😂 Main toh 100 pe hi bhagwaan ko bol rahi thi "bas ab darshan neeche de do!"
Me: 😂 Bhagwaan bole "nahi beta, cardio karo pehle."
She: 😂😂 Gym membership mandir style!
Me: "Mandir Fitness Club — Stairs + Parikrama = Full body workout"
She: 😂 Trainer: Pandit ji!
Me: Protein shake ki jagah prasad ka laddoo!
She: 😂 Best gym ever honestly.
Me: Chalo recovery ke liye neeche chai peete hain — earned it!
She: 😂 Definitely earned it! I'm [her name].
Me: [Name]. Fitness Bhakt!\`
  },
  {
    id: 230,
    title: "Mandir — Havan Smoke",
    category: "Approach",
    text: \`*Context: Both coughing from havan/yajna smoke...*

Me: *coughing* Yeh havan hai ya smoke machine? DJ night lag rahi hai.
She: 😂 *also coughing* Seriously! Aankhon mein paani aa gaya.
Me: Bhagwaan bol rahe hain "rote rote aao mere paas — full emotion dikhao."
She: 😂😂 Emotional entry mandatory!
Me: Main toh sunglasses pehen ke aata hoon next time — pro devotee.
She: 😂 Mask bhi laga lena — COVID aur havan dono se protection.
Me: Double protection! Smart bhakt.
She: 😂 Survival skills for mandir!
Me: Next time saath mein aayenge — main mask laaunga, tum sunglasses.
She: 😂 Team Havan Survivors!
Me: T-shirt bhi banwa lete hain — "I Survived Mandir Havan 2024"
She: 😂 I'd wear that! I'm [her name].
Me: [Name]. Chief Smoke Officer!\`
  },
  {
    id: 231,
    title: "Mandir — Temple Pond/Kund",
    category: "Approach",
    text: \`*Context: Both looking at the temple pond/kund...*

Me: Yeh pond mein coin daalne se wish puri hoti hai kya? Ya phir yeh sirf pond ka revenue model hai?
She: 😂 Revenue model! Pond ka apna UPI hona chahiye.
Me: "Pay to Pond — Scan QR, Make a Wish" — startup idea!
She: 😂😂 Shark Tank mein jaao iske saath!
Me: Ashneer bolega "yeh sab doglapan hai" — par pond profitable hai.
She: 😂 Valuations mein toh achha lagega — centuries of revenue!
Me: Ancient fintech! Pond OG payment gateway tha.
She: 😂 Before Paytm, there was Pondtm!
Me: 😂 Tagline: "Paisa phenk, tamasha dekh!"
She: 😂😂 IPO kab la rahe ho?
Me: Jab tum co-founder banogi! Chai pe discuss karte hain?
She: 😂 Best pitch ever! I'm [her name].
Me: [Name]. Founder, Pondtm!\`
  },
  {
    id: 232,
    title: "Mandir — Anniversary Celebration",
    category: "Approach",
    text: \`*Context: Mandir anniversary celebration with decorations everywhere...*

Me: Yeh mandir ki anniversary hai ya shaadi? Itna decoration!
She: 😂 Lagta hai mandir ne apna swayamvar rakha hai.
Me: Swayamvar mein main bhi khada ho jata hoon — chance toh le lete hain.
She: 😂 Condition kya hai? Dhanush todna?
Me: Nahi, 500 steps chadh ke bina rukey aana — modern version.
She: 😂 Toh aaj main fail ho gayi — 3 baar ruki!
Me: Koi nahi, re-attempt allowed hai. Main bhi 5 baar ruka tha.
She: 😂 Dono disqualified!
Me: Chalo phir hum dono consolation prize le lete hain — chai aur samosa.
She: 😂 Best consolation prize!
Me: [Name] btw. Disqualified Swayamvar Contestant.
She: 😂 I'm [her name]. Fellow Disqualified!\`
  },
  {
    id: 233,
    title: "Mandir — Early Morning Rush",
    category: "Approach",
    text: \`*Context: 5 AM mandir visit, both looking sleepy...*

Me: *yawning* Bhagwaan 5 baje open hote hain — par meri aankhein 10 baje khulti hain.
She: 😂 Same! Mummy ne zor se uthaya.
Me: Classic mummy move — "Uth ja beta, bhagwaan bhi jaag gaye!"
She: 😂😂 Exact same dialogue! Universal mummy script.
Me: Mummy ka alarm system NASA se powerful hai — snooze option nahi hai.
She: 😂 "Ek aur baar bolungi toh chappal aayegi" — that's the alarm.
Me: 😂 Chappal alarm — 100% success rate since 1947.
She: 😂😂 Independence ke baad bhi chappal se azaadi nahi mili!
Me: Deep thought for 5 AM! Chai leni chahiye — brain activate ho jayega.
She: 😂 Haan please, yahan koi stall khula hai kya?
Me: Bahar ek uncle ke paas milegi — chalo saath mein?
She: Done! I'm [her name].
Me: [Name]. 5 AM Warrior (forcefully)!\`
  },
  {
    id: 234,
    title: "Mandir — Volunteer/Seva",
    category: "Approach",
    text: \`*Context: Both volunteering at mandir for prasad distribution...*

Me: Yeh mera first time hai seva karte hue — training dogi kya?
She: 😂 Training? Bas thali mein halwa daal do aur smile do.
Me: Smile toh hai par halwa kitna daalun — zyada daal diya toh loss ho jayega.
She: 😂 Yeh mandir hai, restaurant nahi — portion control mat karo!
Me: Sorry, mera business mind activate ho gaya — "per plate cost optimization."
She: 😂😂 MBA kiya hai kya?
Me: Nahi par mandir mein MBA apply karna alag experience hai.
She: 😂 "Prasad Distribution — A Case Study" — Harvard submit karo!
Me: Co-author banogi? Credit share karenge.
She: 😂 Done! Research partner!
Me: [Name] btw. Aspiring Prasad Economist.
She: 😂 I'm [her name]. Halwa Quality Control Head!\`
  },
  {
    id: 235,
    title: "Mandir — Janmashtami Dahi Handi",
    category: "Approach",
    text: \`*Context: Janmashtami celebration, dahi handi setup...*

Me: Main neeche waali layer mein hoon — matlab sab ka weight main utha raha hoon. Story of my life.
She: 😂 Always the support system, never the star?
Me: Exactly! Upar waala handi todta hai, photo uski aati hai. Neeche waala — hospital jaata hai.
She: 😂😂 So relatable! Main toh dekhne aayi hoon bas.
Me: Smart choice! Spectator category — safest position.
She: 😂 Risk-free devotion!
Me: VIP spectator ho — premium darshan. Main toh stunt department mein hoon.
She: 😂 Insurance karwa liya?
Me: Bhagwaan ki insurance hai — "Shri Krishna Protection Plan."
She: 😂 Premium kitna hai?
Me: Ek dahi handi aur do ladoo — annual plan.
She: 😂 Affordable! I'm [her name].
Me: [Name]. Krishna Insurance Agent!\`
  },
  {
    id: 236,
    title: "Mandir — Shivratri Night Vigil",
    category: "Approach",
    text: \`*Context: Shivratri jagran, both trying to stay awake at 2 AM...*

Me: *yawning* Bholenath jaag rahe hain toh hum bhi — par bholenath ko neend nahi aati, mujhe aa rahi hai.
She: 😂 Same! Aankhein band ho rahi hain.
Me: Trick batata hoon — har 5 minute mein ek scary thought socho. Sleep gone!
She: 😂 Kaunsa scary thought?
Me: "Monday aa raha hai" — instant jagran!
She: 😂😂 Most terrifying thought possible!
Me: Bholenath bhi Monday se darte hain — isliye Himalayas mein rehte hain. No office.
She: 😂 WFH pioneer — Mahadev!
Me: LinkedIn profile: "Remote Worker | Mountains | 1000+ years experience"
She: 😂 Skills: Meditation, Tandav, Third Eye Management
Me: 😂 Endorsement by Parvati ji — 5 star review!
She: 😂 Best profile! Chai leke aata hai koi?
Me: Main le ke aata hoon — jagran fuel chahiye! I'm [Name].
She: I'm [her name]. Night shift buddy!\`
  },
  {
    id: 237,
    title: "Mandir — Chhath Puja Ghat",
    category: "Approach",
    text: \`*Context: Chhath Puja at the ghat, both standing in water...*

Me: Yeh paani itna thanda hai — meri devotion test ho rahi hai!
She: 😂 Haan! Paani mein khade hoke surya dev ko arghya — extreme devotion.
Me: Surya Dev dekh rahe honge — "yeh log mere liye thand mein khade hain — kya fans hain!"
She: 😂😂 Biggest fan following — literally billions!
Me: Surya Dev original influencer hain — daily sunrise content.
She: 😂 Never misses a post! Consistent since forever!
Me: Blue tick bhi nahi chahiye — sabko pata hai asli hain.
She: 😂 Verified by nature!
Me: Chalo arghya ke baad thakua khayenge — earned it!
She: 😂 Haan! Thakua is the best part honestly.
Me: Best festival food! I'm [Name].
She: I'm [her name]. Chhath food buddy!\`
  },
  {
    id: 238,
    title: "Mandir — Saraswati Puja Pandal",
    category: "Approach",
    text: \`*Context: Saraswati Puja, she's placing books near the idol for blessing...*

Me: Main bhi apna phone rakh deta hoon — usme bhi knowledge hai... YouTube University ka.
She: 😂 YouTube University — degree milti hai kya?
Me: Haan! "Bachelor of Random Knowledge — Specialization: 3 AM Rabbit Holes"
She: 😂😂 Major: Conspiracy Theories, Minor: Cat Videos!
Me: GPA: "It's complicated."
She: 😂 Saraswati Maa confused hongi — "yeh kya padh raha hai?"
Me: Maa bolegi "beta, yeh knowledge nahi, yeh time waste hai." Fair point.
She: 😂 Relatable! Main bhi phone pe hi hoon mostly.
Me: Chalo aaj se real books padhte hain — accountability partner chahiye?
She: 😂 Done! Par books kaunsi?
Me: Woh chai pe decide karte hain — abhi puja ke baad?
She: Sure! I'm [her name].
Me: [Name]. YouTube University Topper!\`
  },
  {
    id: 239,
    title: "Mandir — Ram Navami Procession",
    category: "Approach",
    text: \`*Context: Ram Navami procession, both watching from the side...*

Me: Yeh procession itna grand hai — meri society ki annual function ki band baj gayi competition mein.
She: 😂 Society function mein kya hota hai?
Me: Uncle log karaoke karte hain — "Ek pyaar ka nagma hai" — par sur nahi hai.
She: 😂😂 Har society mein ek karaoke uncle hota hai!
Me: Aur ek aunty jo dance karti hai — freestyle, koi specific form nahi.
She: 😂 "Contemporary classical fusion" — aunty ka style!
Me: 😂 Yahan toh professional hai sab — dhol, dance, sab set.
She: Haan, procession mein alag hi energy hoti hai!
Me: Next year saath mein participate karenge? Main dhol bajaunga.
She: 😂 Dhol aata hai tumhe?
Me: Nahi, par YouTube University se seekh lunga — 2 din mein expert.
She: 😂 I'm [her name].
Me: [Name]. Future Dhol Champion!\`
  },
  {
    id: 240,
    title: "Mandir — Hanuman Chalisa Group",
    category: "Approach",
    text: \`*Context: Tuesday evening Hanuman Chalisa recitation group...*

Me: *whispering* Main lyrics bhool gaya — prompter chahiye.
She: 😂 *whispering back* Google karo!
Me: Mandir mein phone nikaalunga toh pandit ji ka trishul aayega.
She: 😂 Toh meri copy share kar lo — *shows book*
Me: Thanks! Tum toh prepared aati ho — topper vibes.
She: 😂 Mandir ki topper — isse achha compliment nahi mila aaj tak!
Me: "Most Devoted Student — Hanuman Academy" — certificate banwa deta hoon.
She: 😂😂 Frame karke lagaungi!
Me: Main toh backbencher hoon — "present sir" bolke so jaata hoon.
She: 😂 Har jagah backbencher!
Me: Par backbenchers ki life zyada fun hoti hai — chai pe discuss karte hain?
She: 😂 Done! I'm [her name].
Me: [Name]. Backbencher Bhakt since '99!\`
  }
];
