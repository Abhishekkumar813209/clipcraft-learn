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
  }
];
