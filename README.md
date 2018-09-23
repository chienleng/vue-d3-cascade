# Vue D3 Cascade Stacked Vis

## Basic use of component
Import the component, i.e.
```
import StackedCascade from '@/components/StackedCascade.vue'
```

HTML
```
<stacked-cascade
  :chartData="[
    { stage: 'Prevalent', all: 4000 },
    { stage: 'Screened', all: 3000 },
    { stage: 'Diagnosed', all: 2000 },
    { stage: 'Treated', all: 1000 },
    { stage: 'Controlled', all: 500 },
  ]"
  :keys="['all']"
  :dict="{ all: 'All Population' }"
  :yAxisTitle="'Number of people'"
  :h="400"
  :colourScheme="['#3182bd']"
  :legendDisplay="true" />
```

## Component Props

`chartData` **(required)** — List of stages with key/values
e.g.
```
[
  { stage: 'Prevalent', all: 4000 },
  { stage: 'Screened', all: 3000 },
  { stage: 'Diagnosed', all: 2000 },
  { stage: 'Treated', all: 1000 },
  { stage: 'Controlled', all: 500 },
]
```

`keys` **(required)** — the keys in the array (not including `stages`)
e.g.
```
['all']
```


`dict` _(optional)_ — Long labels for the keys
e.g.
```
{ all: 'All Population' }
```

`yAxisTitle` _(optional)_ — Y Axis Title
e.g.
```
'Number of people'
```

`h` _(optional)_ — Chart height
e.g.
```
400
```

`colourScheme` _(optional)_ — Array of colours (or you can also use d3.scale-chromatic, i.e. d3.schemePaired)
e.g.
```
['#3182bd']
```

`legendDisplay` _(optional)_ — boolean
e.g.
```
true
```


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```
