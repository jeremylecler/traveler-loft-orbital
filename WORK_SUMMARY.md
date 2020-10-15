<h1 align="center">Traveler - Work summary</h1>

<h2>Introduction:</h2>

The briefing being quite free, I approached the project as the realization of a complete website:

<ul>
  <li>Reflection on demand and constraints</li>
  <li>Definition of the different functionalities of the site</li>
  <li>Search for graphic inspiration</li>
  <li>Creation of an identity (logo, choice of colors, typography)</li>
  <li>Creation of the different models of the pages taking into account the user experience</li>
  <li>API initialization</li>
  <li>Front development</li>
  <li>Animations of the different elements</li>
  <li>Responsive variation (portrait and landscape tablet, smartphone)</li>
  <li>Optimizations (code and assets)</li>
  <li>Test and corrections according to different browsers (Chrome, Safari, Firefox)</li>
  <li>Comment the code</li>
</ul>

I worked on the project in the evening after my work.


<h2>Upgrading skills:</h2>

I hadn't used GraphQL for a while. And I had never had the opportunity to use it with Vue.js.
So I had to upgrading my skills and look for good practices.
Apollo seemed to fit the needs, and a special version for Vue.js exists.
Its use in my code can certainly be optimized and follow best practices, but it still works.
With more time, I intend to explore this point further.


<h2>Project study:</h2>

Starting from the initial briefing, I defined several features that I wanted to implement on the Traveler site.
I immediately studied the information that the API returned to me.
Unfortunately the proposed API (Everbase) is no longer available. So I had to take the alternative of Trevorblades. The latter seems to have much less information, but Pierre Bertrand confirmed to me that there was no problem.

<h3>Features:</h3>

<ul>
  <li>Search engine (search for a continent or a country)</li>
  <li>Interactive map to visualize the different continents and countries</li>
  <li>Country suggestions</li>
  <li>Exchange rate</li>
  <li>Translation of the site in multiple languages</li>
  <li>Filter countries and continents (by languages spoken for example)</li>
  <li>Comparison between two countries or continents</li>
  <li>Favorites system (create trip stops)</li>
</ul>

I had to make a choice in these features, to select the most relevant to achieve, to deliver the project on time.


<h2>Inspiration:</h2>

The second step in my creation process was to look at what was happening in the field.
So I used Pinterest and Dribble to find different UX / UI inspirations (available in the /02_DESIGN/Inspirations folder).


<h2>Graphic identity:</h2>

It was necessary to define some elementary graphic rules:

<h3>Typography</h3>
Euclid Square: Modern, elegant, available in many thicknesses.

<h3>Colors:</h3>
Blue: #3993f6 Fresh, modern, reminiscent of the water that covers the Earth.
Orange: #fea400 Dynamic, powerful, reminiscent of earth and sand.

<h3>Logo:</h3>
Icon with thin lines. Evokes the planet Earth in a rotating motion, inspiring speed and movement.

<h3>Pages:</h3>
I took the time to do some of the different pages. The goal was to have a clear vision of the end result and to be able to develop the free spirit.
I used Sketch software, very suitable for creating web models. It allows to keep the logic "components".

<h4>> Home:</h4>
I wanted the Home page to be an invitation to travel. It was essential to highlight the different continents of the world.
I worked on a first version inspired by a photo lens, but I preferred to start with a more refined proposal.

For that I opted for the use of a swiper which allows the display of the 7 continents without the user having to scroll in the page.
I wanted to highlight these different parts of the world, to do this I used 2 photos (thank you Google) for each continent: a thumbnail photo and a cover photo.
The user had to be able to access the different functionalities directly on this page:
There is a button "Explore the World", allowing access to the map.
The swiper cards allow access to specific continent.
The search engine is accessible at the top right.
The user can change the language.

<h4>> Continents / Map:</h4>
The world is big, so the map had to be fullscreen.
The user can zoom in / out on the map.
To facilitate navigation, it was necessary to separate access to continents and countries.
By default, the map is in "continents" mode. When the mouse hovers over them, the user sees a tooltip appear with the essential information of the continent.
Clicking on it zooms in and the map switches to "country" mode. Thus the user will be able to explore the countries of the world.

<h4>> Continent / Country:</h4>
The API didn't return much information to me, so I had to deal with what I had.
When clicking on a country or continent, the map shifts to the right, leaving room for a panel grouping together the information.
Pushes invite the user to discover the different countries of the continent.


<h2>Development:</h2>

<h3>Connection with API:</h3>
I first used Apollo to connect Vue.js to the GraphQL API. I tried to respect the best practices that I could find on the internet.
The different calls are found in the "graphql.js" file (/src/config/graphql.js).

<h3>Router and languages:</h3>
I am using a custom translation system, based on i18n.
This system allows the various texts of the site to be grouped together in .json files (/src/locales/xxxx.json).
The different ends are accessible in Vue ( example: $t('global.back') ).
The language is detected upon arrival on the site (in the beforeEach, /src/main.js). It is based on the browser language.
A slug :locale is added to the route, allowing the language to be identified. You just have to change this slug to change the language in real time.
The different pages of the site are children of this new route.

In the continent and country pages, the API is based on the slug :code to get the right information.

<h3>Store:</h3>
The store is little used in this version. I store information about the position of the cursor and the scroll in the page. This information is used to run different custom libraries allowing different effects (scrollParallax, mouseParallax, etc.)

<h3>Loader:</h3>
The loader uses the Preloader.js library, allowing to preload the various assets of the site (images). It also listens to the initialization of the map which is done in the background. Once the images are loaded and the map ready, the site is accessible.

<h3>Home:</h3>
The home swiper uses the Swiper.js library. I used to work with her. It is efficient, easy to use and compatible with all browsers and touchscreen.
The background cover image uses a custom library to create a parallax effect to the movement of the mouse or the angle of the smartphone.

<h3>Continent sheet:</h3>
When the continent panel opens, the API will look for information about it based on the slug :code.
The internal scroll is managed by the perfect-scrollbar library. An event listens to the scroll to create a sticky effect on the header of the panel (/src/mixins/panel.js).
The languages spoken are sorted by browsing the countries of the continent.
When clicking on a CountryPush.vue push, the user enters the details of a country and the map zooms in on it.

<h3>Country sheet:</h3>
When the continent panel opens, the API will look for information about it based on the slug :code.
The internal scroll is managed by the perfect-scrollbar library. An event listens to the scroll to create a sticky effect on the header of the panel (/src/mixins/panel.js).
The information regarding population, GDP and CO2 emissions is false. This is a choice on my part, as I wanted to show you the kind of information the user might have found if the Everbase API had worked.
If the country has states, then these are displayed as a list.
The user can also convert his money into another currency. This system is based on an external API (https://api.exchangeratesapi.io), on which I connect with Axios.
The suggested countries are limited to 2 and sorted according to the other countries associated with the continent of the country.

<h3>Search engine:</h3>
It has 2 states:
One open and one closed (on the details of a continent or country).
Based on the content entered in an input [type="text"], if there is a match, then the user navigates to the requested continent or country.
To do this, when submitting the form, the content of the input is passed into a slugify() (/src/plugins/tools.js) function, then a first loop is performed on all the continents. If no results are found, then a second loop is performed on the countries. This order makes it possible to optimize the search (there are 7 continents vs 250 countries).
If there is no match, an error message is displayed.

<h3>Exchange rate:</h3>
The exchange rates are retrieved using an API. To do so I use Axios. In real time, the user can transform their money into another currency.

<h3>Map:</h3>
The interactive map uses the AmChart library. I have already used this library for a project for EDF in partnership with Ipsos.
Its use can seem complex, so I tried as much as possible to segment my code.

It has 2 states: A first zoom displaying the continents and a second displaying the countries. These states switch automatically when viewing a details sheet, or by clicking on the button located at the bottom left of the map.
You can zoom in using the mouse or the buttons provided.

The map is initiated upon arrival on the site, to avoid a slowing down effect when changing page.
When it is created, it will retrieve all the information from the API, then initialize itself.
The continents and countries displayed are created by passing in the createContinentsSerie() and createCountriessSerie() (/src/components/partials/Map.vue) functions.
Once "ready" it $emits an event to the Loader to tell it that it can display the site.

When the cursor passes over an element of the map, a tooltip, grouping together different information, appears and follows the movements.

When clicking on an element, the map zooms on it while listening to the change of route of the router (function zoom(), change the slug :code). I opted to use the route, because a user can arrive on the site directly on a details page, and the map must be able to zoom even without interaction.


<h2>Animations :</h2>

The realization of beautiful animations, rhythmic, coherent and fluid is a work in itself. It requires upstream thinking and building its components accordingly.
I routinely use GSAP's TweenMax, coupled with Vue.js transitions system (for state changes).
Each page has its transitionEnter() and transitionLeave() functions which manage the different input and output animations (/src/RouterView.vue).


<h2>Responsive :</h2>

The responsive uses 4 breaking points:

<ul>
  <li>Iphone 5: $xsmall = 'screen and (max-width: 400px) and (max-height: 500px)'</li>
  <li>Iphone6: $small = 'screen and (max-width: 600px)'</li>
  <li>Tablet portrait: $medium = 'screen and (max-width: 960px)'</li>
  <li>Tablet landscape: $large = 'screen and (max-width: 1100px)'</li>
</ul>

We had to make concessions on smartphone features.
Due to the lack of space available on the screen and the touch screen, the map is less advanced.


<h2>Optimization:</h2>

The images are passed through several software to optimize their size: ImageAlpha and ImageOptim.
During the build in production, a new optimization is done automatically.

Regarding the animations, it was necessary at times to add artificial delays and sequence them so that the rendering is fluid (especially when a details page appears and the transition to the right of the map).


<h2>Testing and corrections:</h2>

I tested the site on different browsers (Chrome, Safari, Firefox).
I shared the site with different friends for them to test on several devices. If they found any bugs, then I fixed them.


<h2>Conclusion:</h2>

I really enjoyed doing this project for Loft Orbital.
Development is most of the work, but I enjoyed thinking and building the Traveler site.
In my opinion, for a production to be of quality, even as a developer, you have to put yourself in the user's shoes and understand their needs. And that's what I love to do.

<i>Thanks for reading me</i>