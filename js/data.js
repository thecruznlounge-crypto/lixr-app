/* Lixr — built-in drink library (works offline).
   Amounts are stored in US fluid ounces unless a unit is given.
   Names are generic on purpose: no brand names in drink titles. */
window.LIXR_LIBRARY = [
  {
    id: 'island-vibe', name: 'Island Vibe', cat: 'cocktail', glass: 'rocks',
    color: '#5BD8FF', color2: '#0A7FD0', garnish: 'pineapple', trending: true,
    desc: 'A tropical, rum-forward cocktail with a smooth coconut and pineapple finish.',
    tags: ['rum', 'pineapple', 'coconut', 'blue curacao', 'tropical', 'blue'],
    ingredients: [
      { amt: 2, unit: 'oz', item: 'White rum' },
      { amt: 1, unit: 'oz', item: 'Pineapple juice' },
      { amt: 1, unit: 'oz', item: 'Coconut cream' },
      { amt: 0.5, unit: 'oz', item: 'Blue curaçao' },
      { amt: 0.5, unit: 'oz', item: 'Lime juice' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Fill a shaker with ice.',
      'Add rum, pineapple juice, coconut cream, blue curaçao and lime juice.',
      'Shake well for 10–15 seconds.',
      'Strain into a glass over fresh ice.',
      'Garnish with pineapple and a cherry.'
    ],
    mocktail: {
      ingredients: [
        { amt: 2, unit: 'oz', item: 'Coconut water' },
        { amt: 1.5, unit: 'oz', item: 'Pineapple juice' },
        { amt: 1, unit: 'oz', item: 'Coconut cream' },
        { amt: 0.5, unit: 'oz', item: 'Blue spirulina syrup (or blue raspberry syrup)' },
        { amt: 0.5, unit: 'oz', item: 'Lime juice' },
        { amt: null, unit: '', item: 'Ice' }
      ],
      steps: [
        'Fill a shaker with ice.',
        'Add coconut water, pineapple juice, coconut cream, blue syrup and lime juice.',
        'Shake well for 10–15 seconds.',
        'Strain into a glass over fresh ice and garnish with pineapple.'
      ]
    }
  },
  {
    id: 'miami-heat', name: 'Miami Heat', cat: 'cocktail', glass: 'coupe',
    color: '#FF4FA0', color2: '#C2185B', garnish: 'lime',
    desc: 'Bright pink and a little sweet, with dragon fruit, fresh lime and a clean vodka base.',
    tags: ['vodka', 'dragon fruit', 'lime', 'agave', 'pink'],
    ingredients: [
      { amt: 2, unit: 'oz', item: 'Vodka' },
      { amt: 1, unit: 'oz', item: 'Dragon fruit purée' },
      { amt: 0.75, unit: 'oz', item: 'Fresh lime juice' },
      { amt: 0.5, unit: 'oz', item: 'Agave syrup' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Add everything to a shaker with ice.',
      'Shake hard for 15 seconds.',
      'Double-strain into a chilled coupe.',
      'Garnish with a lime wheel.'
    ],
    mocktail: {
      ingredients: [
        { amt: 2, unit: 'oz', item: 'Sparkling water' },
        { amt: 1.5, unit: 'oz', item: 'Dragon fruit purée' },
        { amt: 0.75, unit: 'oz', item: 'Fresh lime juice' },
        { amt: 0.5, unit: 'oz', item: 'Agave syrup' },
        { amt: null, unit: '', item: 'Ice' }
      ],
      steps: [
        'Shake purée, lime and agave with ice.',
        'Strain into a chilled coupe and top with sparkling water.',
        'Garnish with a lime wheel.'
      ]
    }
  },
  {
    id: 'midnight-luxe', name: 'Midnight Luxe', cat: 'cocktail', glass: 'rocks',
    color: '#7B2CBF', color2: '#2E0854', garnish: 'blackberry',
    desc: 'Deep and fruity: cognac and muddled blackberry, brightened with lemon and a sparkling top.',
    tags: ['cognac', 'blackberry', 'lemon', 'sparkling', 'purple'],
    ingredients: [
      { amt: 4, unit: '', item: 'Blackberries' },
      { amt: 1.5, unit: 'oz', item: 'Cognac' },
      { amt: 0.75, unit: 'oz', item: 'Fresh lemon juice' },
      { amt: 0.5, unit: 'oz', item: 'Simple syrup' },
      { amt: 2, unit: 'oz', item: 'Sparkling wine' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Muddle the blackberries in a shaker.',
      'Add cognac, lemon juice, simple syrup and ice.',
      'Shake for 10 seconds and strain over fresh ice.',
      'Top with sparkling wine and garnish with a blackberry.'
    ],
    mocktail: {
      ingredients: [
        { amt: 4, unit: '', item: 'Blackberries' },
        { amt: 1.5, unit: 'oz', item: 'Black tea, chilled' },
        { amt: 0.75, unit: 'oz', item: 'Fresh lemon juice' },
        { amt: 0.5, unit: 'oz', item: 'Simple syrup' },
        { amt: 3, unit: 'oz', item: 'Sparkling white grape juice' },
        { amt: null, unit: '', item: 'Ice' }
      ],
      steps: [
        'Muddle the blackberries in a shaker.',
        'Add tea, lemon juice, syrup and ice; shake and strain over fresh ice.',
        'Top with sparkling grape juice and garnish with a blackberry.'
      ]
    }
  },
  {
    id: 'blue-wave', name: 'Blue Wave', cat: 'cocktail', glass: 'highball',
    color: '#6FE3FF', color2: '#1478D4', garnish: 'pineapple', trending: true,
    desc: 'A tall, ocean-blue cooler with vodka, rum, pineapple and a sweet-and-sour finish.',
    tags: ['vodka', 'rum', 'blue curacao', 'pineapple', 'blue', 'tropical'],
    ingredients: [
      { amt: 1, unit: 'oz', item: 'Vodka' },
      { amt: 1, unit: 'oz', item: 'White rum' },
      { amt: 0.75, unit: 'oz', item: 'Blue curaçao' },
      { amt: 3, unit: 'oz', item: 'Pineapple juice' },
      { amt: 1, unit: 'oz', item: 'Sweet and sour mix' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Fill a tall glass with ice.',
      'Add vodka, rum and blue curaçao.',
      'Top with pineapple juice and sweet and sour mix.',
      'Stir gently and garnish with a pineapple wedge.'
    ],
    mocktail: {
      ingredients: [
        { amt: 4, unit: 'oz', item: 'Pineapple juice' },
        { amt: 2, unit: 'oz', item: 'Lemon-lime soda' },
        { amt: 0.75, unit: 'oz', item: 'Blue raspberry syrup' },
        { amt: 0.5, unit: 'oz', item: 'Lime juice' },
        { amt: null, unit: '', item: 'Ice' }
      ],
      steps: [
        'Fill a tall glass with ice.',
        'Add syrup, lime and pineapple juice.',
        'Top with soda, stir gently and garnish with pineapple.'
      ]
    }
  },
  {
    id: 'strawberry-cognac-smash', name: 'Strawberry Cognac Smash', cat: 'cocktail', glass: 'coupe',
    color: '#FF4B5C', color2: '#B0102A', garnish: 'strawberry', trending: true,
    desc: 'Fresh strawberries smashed with cognac, lemon and a touch of sweetness.',
    tags: ['cognac', 'strawberry', 'lemon', 'red', 'smash'],
    ingredients: [
      { amt: 3, unit: '', item: 'Strawberries, hulled' },
      { amt: 2, unit: 'oz', item: 'Cognac' },
      { amt: 0.75, unit: 'oz', item: 'Fresh lemon juice' },
      { amt: 0.5, unit: 'oz', item: 'Simple syrup' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Muddle the strawberries in a shaker.',
      'Add cognac, lemon juice, simple syrup and ice.',
      'Shake hard for 15 seconds.',
      'Double-strain into a chilled coupe and garnish with a strawberry.'
    ],
    mocktail: {
      ingredients: [
        { amt: 3, unit: '', item: 'Strawberries, hulled' },
        { amt: 2, unit: 'oz', item: 'Apple cider' },
        { amt: 0.75, unit: 'oz', item: 'Fresh lemon juice' },
        { amt: 0.5, unit: 'oz', item: 'Simple syrup' },
        { amt: 1, unit: 'oz', item: 'Ginger beer' },
        { amt: null, unit: '', item: 'Ice' }
      ],
      steps: [
        'Muddle the strawberries in a shaker.',
        'Add cider, lemon, syrup and ice; shake hard.',
        'Strain into a coupe, top with ginger beer and garnish with a strawberry.'
      ]
    }
  },
  {
    id: 'chocolate-martini', name: 'Chocolate Martini', cat: 'cocktail', glass: 'martini',
    color: '#9A6440', color2: '#4A2A16', garnish: 'cream', trending: true,
    desc: 'Rich and dessert-like, with chocolate liqueur, vodka and cream.',
    tags: ['vodka', 'chocolate', 'cream', 'dessert', 'brown'],
    ingredients: [
      { amt: 1.5, unit: 'oz', item: 'Vodka' },
      { amt: 1.5, unit: 'oz', item: 'Chocolate liqueur' },
      { amt: 1, unit: 'oz', item: 'Half-and-half' },
      { amt: 1, unit: 'tbsp', item: 'Chocolate syrup (for the glass)' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Swirl chocolate syrup inside a chilled martini glass.',
      'Shake vodka, chocolate liqueur and half-and-half with ice.',
      'Strain into the glass.',
      'Top with whipped cream or shaved chocolate.'
    ],
    mocktail: {
      ingredients: [
        { amt: 3, unit: 'oz', item: 'Cold whole milk' },
        { amt: 1, unit: 'oz', item: 'Chocolate syrup' },
        { amt: 0.25, unit: 'tsp', item: 'Vanilla extract' },
        { amt: null, unit: '', item: 'Ice' }
      ],
      steps: [
        'Swirl chocolate syrup inside a chilled martini glass.',
        'Shake milk, syrup and vanilla with ice until frothy.',
        'Strain into the glass and top with whipped cream.'
      ]
    }
  },
  {
    id: 'classic-margarita', name: 'Classic Margarita', cat: 'cocktail', glass: 'coupe',
    color: '#E9F59A', color2: '#B9CC3A', garnish: 'lime',
    desc: 'The bright, salty-sour standard: tequila, lime and orange liqueur.',
    tags: ['tequila', 'lime', 'orange', 'salt', 'margarita'],
    ingredients: [
      { amt: 2, unit: 'oz', item: 'Blanco tequila' },
      { amt: 1, unit: 'oz', item: 'Fresh lime juice' },
      { amt: 0.75, unit: 'oz', item: 'Orange liqueur' },
      { amt: 0.25, unit: 'oz', item: 'Agave syrup' },
      { amt: null, unit: '', item: 'Coarse salt and ice' }
    ],
    steps: [
      'Rub a lime wedge on the rim and dip it in salt.',
      'Shake tequila, lime, orange liqueur and agave with ice.',
      'Strain into the glass over fresh ice or straight up.',
      'Garnish with a lime wheel.'
    ],
    mocktail: {
      ingredients: [
        { amt: 3, unit: 'oz', item: 'Sparkling water' },
        { amt: 1, unit: 'oz', item: 'Fresh lime juice' },
        { amt: 1, unit: 'oz', item: 'Fresh orange juice' },
        { amt: 0.5, unit: 'oz', item: 'Agave syrup' },
        { amt: null, unit: '', item: 'Coarse salt and ice' }
      ],
      steps: [
        'Salt the rim of the glass.',
        'Shake lime, orange juice and agave with ice.',
        'Strain into the glass and top with sparkling water.'
      ]
    }
  },
  {
    id: 'spicy-cucumber-margarita', name: 'Spicy Cucumber Margarita', cat: 'cocktail', glass: 'rocks',
    color: '#C9F27A', color2: '#6FA82A', garnish: 'lime',
    desc: 'Cool cucumber and a jalapeño kick over a classic tequila sour.',
    tags: ['tequila', 'cucumber', 'jalapeno', 'spicy', 'lime', 'green'],
    ingredients: [
      { amt: 3, unit: '', item: 'Cucumber slices' },
      { amt: 2, unit: '', item: 'Jalapeño slices' },
      { amt: 2, unit: 'oz', item: 'Blanco tequila' },
      { amt: 1, unit: 'oz', item: 'Fresh lime juice' },
      { amt: 0.75, unit: 'oz', item: 'Agave syrup' },
      { amt: null, unit: '', item: 'Tajín and ice' }
    ],
    steps: [
      'Rim a rocks glass with Tajín.',
      'Muddle cucumber and jalapeño in a shaker.',
      'Add tequila, lime, agave and ice; shake hard.',
      'Strain over fresh ice and garnish with cucumber.'
    ],
    mocktail: {
      ingredients: [
        { amt: 3, unit: '', item: 'Cucumber slices' },
        { amt: 1, unit: '', item: 'Jalapeño slice' },
        { amt: 1, unit: 'oz', item: 'Fresh lime juice' },
        { amt: 0.75, unit: 'oz', item: 'Agave syrup' },
        { amt: 3, unit: 'oz', item: 'Sparkling water' },
        { amt: null, unit: '', item: 'Tajín and ice' }
      ],
      steps: [
        'Rim a rocks glass with Tajín.',
        'Muddle cucumber and jalapeño; add lime, agave and ice and shake.',
        'Strain over fresh ice and top with sparkling water.'
      ]
    }
  },
  {
    id: 'mojito', name: 'Classic Mojito', cat: 'cocktail', glass: 'highball',
    color: '#EAFBD8', color2: '#A8DC7A', garnish: 'mint',
    desc: 'Mint, lime, rum and soda: tall, cold and refreshing.',
    tags: ['rum', 'mint', 'lime', 'soda', 'mojito', 'green'],
    ingredients: [
      { amt: 8, unit: '', item: 'Mint leaves' },
      { amt: 1, unit: 'oz', item: 'Fresh lime juice' },
      { amt: 0.75, unit: 'oz', item: 'Simple syrup' },
      { amt: 2, unit: 'oz', item: 'White rum' },
      { amt: 2, unit: 'oz', item: 'Club soda' },
      { amt: null, unit: '', item: 'Crushed ice' }
    ],
    steps: [
      'Gently press the mint with lime and syrup in a tall glass.',
      'Add rum and fill with crushed ice.',
      'Top with club soda and stir.',
      'Garnish with a mint sprig.'
    ],
    mocktail: {
      ingredients: [
        { amt: 8, unit: '', item: 'Mint leaves' },
        { amt: 1, unit: 'oz', item: 'Fresh lime juice' },
        { amt: 0.75, unit: 'oz', item: 'Simple syrup' },
        { amt: 4, unit: 'oz', item: 'Club soda' },
        { amt: null, unit: '', item: 'Crushed ice' }
      ],
      steps: [
        'Gently press the mint with lime and syrup in a tall glass.',
        'Fill with crushed ice and top with club soda.',
        'Stir and garnish with a mint sprig.'
      ]
    }
  },
  {
    id: 'pina-colada', name: 'Piña Colada', cat: 'cocktail', glass: 'hurricane',
    color: '#FFF6D8', color2: '#F3D77A', garnish: 'pineapple',
    desc: 'Creamy blended rum, coconut and pineapple, beach-bar style.',
    tags: ['rum', 'coconut', 'pineapple', 'frozen', 'blended', 'tropical'],
    ingredients: [
      { amt: 2, unit: 'oz', item: 'White rum' },
      { amt: 2, unit: 'oz', item: 'Cream of coconut' },
      { amt: 3, unit: 'oz', item: 'Pineapple juice' },
      { amt: 1, unit: 'cup', item: 'Ice' }
    ],
    steps: [
      'Add everything to a blender.',
      'Blend until smooth and thick.',
      'Pour into a tall glass.',
      'Garnish with pineapple and a cherry.'
    ],
    mocktail: {
      ingredients: [
        { amt: 2, unit: 'oz', item: 'Cream of coconut' },
        { amt: 4, unit: 'oz', item: 'Pineapple juice' },
        { amt: 0.5, unit: 'cup', item: 'Frozen pineapple chunks' },
        { amt: 0.5, unit: 'cup', item: 'Ice' }
      ],
      steps: [
        'Blend everything until smooth.',
        'Pour into a tall glass and garnish with pineapple.'
      ]
    }
  },
  {
    id: 'espresso-martini', name: 'Espresso Martini', cat: 'cocktail', glass: 'coupe',
    color: '#5A3420', color2: '#22120A', garnish: 'beans',
    desc: 'Silky, foamy and wide awake: vodka, coffee liqueur and fresh espresso.',
    tags: ['vodka', 'espresso', 'coffee', 'brown'],
    ingredients: [
      { amt: 1.5, unit: 'oz', item: 'Vodka' },
      { amt: 1, unit: 'oz', item: 'Fresh espresso, cooled' },
      { amt: 0.75, unit: 'oz', item: 'Coffee liqueur' },
      { amt: 0.25, unit: 'oz', item: 'Simple syrup' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Add everything to a shaker with plenty of ice.',
      'Shake very hard for 20 seconds to build foam.',
      'Strain into a chilled coupe.',
      'Garnish with three coffee beans.'
    ],
    mocktail: {
      ingredients: [
        { amt: 2, unit: 'oz', item: 'Fresh espresso, cooled' },
        { amt: 0.5, unit: 'oz', item: 'Vanilla syrup' },
        { amt: 1, unit: 'oz', item: 'Cold oat milk' },
        { amt: null, unit: '', item: 'Ice' }
      ],
      steps: [
        'Shake everything very hard with ice.',
        'Strain into a chilled coupe and garnish with coffee beans.'
      ]
    }
  },
  {
    id: 'mango-dragonfruit-refresher', name: 'Mango Dragonfruit Refresher', cat: 'mocktail', glass: 'highball',
    color: '#FF6FA8', color2: '#E0306F', garnish: 'dragonfruit',
    desc: 'The pink coffee-shop favorite, made at home with mango, dragon fruit and white grape.',
    tags: ['mango', 'dragon fruit', 'refresher', 'pink', 'no alcohol'],
    ingredients: [
      { amt: 4, unit: 'oz', item: 'White grape juice' },
      { amt: 2, unit: 'oz', item: 'Mango nectar' },
      { amt: 1, unit: 'tbsp', item: 'Freeze-dried dragon fruit pieces' },
      { amt: 2, unit: 'oz', item: 'Lemonade (optional)' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Fill a shaker with ice.',
      'Add grape juice, mango nectar and dragon fruit pieces.',
      'Shake for 10 seconds.',
      'Pour everything into a tall glass and top with lemonade if you like.'
    ]
  },
  {
    id: 'brown-sugar-shaken-espresso', name: 'Brown Sugar Shaken Espresso', cat: 'coffee', glass: 'highball',
    color: '#C79A6B', color2: '#6B4128', garnish: 'none',
    desc: 'Espresso shaken with brown sugar syrup and cinnamon, topped with oat milk.',
    tags: ['espresso', 'coffee', 'brown sugar', 'oat milk', 'cinnamon', 'iced'],
    ingredients: [
      { amt: 2, unit: 'shots', item: 'Espresso' },
      { amt: 0.75, unit: 'oz', item: 'Brown sugar syrup' },
      { amt: 1, unit: 'pinch', item: 'Ground cinnamon' },
      { amt: 4, unit: 'oz', item: 'Oat milk' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Add espresso, brown sugar syrup and cinnamon to a shaker with ice.',
      'Shake hard for 10 seconds.',
      'Pour into a tall glass.',
      'Top with oat milk.'
    ]
  },
  {
    id: 'taro-milk-tea', name: 'Taro Milk Tea with Boba', cat: 'boba', glass: 'highball',
    color: '#C9A7E8', color2: '#9C74CC', garnish: 'boba',
    desc: 'Creamy, nutty taro milk tea over chewy brown sugar tapioca pearls.',
    tags: ['taro', 'boba', 'milk tea', 'tapioca', 'purple'],
    ingredients: [
      { amt: 0.33, unit: 'cup', item: 'Cooked tapioca pearls' },
      { amt: 1, unit: 'tbsp', item: 'Brown sugar syrup' },
      { amt: 2, unit: 'tbsp', item: 'Taro powder' },
      { amt: 4, unit: 'oz', item: 'Jasmine green tea, chilled' },
      { amt: 4, unit: 'oz', item: 'Milk' },
      { amt: null, unit: '', item: 'Ice' }
    ],
    steps: [
      'Toss the warm pearls in brown sugar syrup and add to a tall glass.',
      'Whisk taro powder into the tea until smooth.',
      'Fill the glass with ice and pour in the tea.',
      'Top with milk and stir with a wide straw.'
    ]
  }
];

window.LIXR_CATS = [
  { id: 'all', label: 'All' },
  { id: 'cocktail', label: 'Cocktails' },
  { id: 'mocktail', label: 'Mocktails' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'boba', label: 'Boba' }
];
