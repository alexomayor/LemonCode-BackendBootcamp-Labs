# Laboratorio MongoDB

Vamos a trabajar con el set de datos de Mongo Atlas _airbnb_. Lo puedes encontrar en este enlace: https://drive.google.com/drive/folders/1gAtZZdrBKiKioJSZwnShXskaKk6H_gCJ?usp=sharing

Para restaurarlo puede seguir las instrucciones de este videopost:
https://www.lemoncode.tv/curso/docker-y-mongodb/leccion/restaurando-backup-mongodb

> Acuerdate de mirar si en el directorio `/opt/app` del contenedor Mongo hay contenido de backups previos que haya que borrar

Para entregar las soluciones, añade un README.md a tu repositorio del bootcamp incluyendo enunciado y consulta (lo que pone '_Pega aquí tu consulta_').

## Introducción

En este base de datos puedes encontrar un montón de alojamientos y sus reviews, esto está sacado de hacer webscrapping.

**Pregunta**. Si montaras un sitio real, ¿Qué posibles problemas pontenciales les ves a como está almacenada la información?

```md
- Dependes de la base de datos de otra empresa, en este caso AirBnB. Cada vez que ellos actualicen su modelo, incluyan, modifiquen o eliminen campos, nosotros tendriamos que actualizar el nuestro (o la conexion entre ellos, mas bien)
- Posible inconsistencia en los datos, como en los formatos usados, distintas categorizaciones u opciones para cada campo.
  Por ejemplo, los valores de minimum_nights y maximum_nights son numeros en formato string, que puede complicar la manipulacion de datos al hacer agrupamientos, filtros u operaciones matematicas.
  Ademas, dentro del objeto amenities, al ser cada elemento un string, puede diferir entre un documento y otro (mayus/minus, espacios, etc.)
- Fragmentacion: Muchos de los campos tienen entradas de texto libre (access, house_rules, interaction, neightborhood_overview, etc) por lo que se fragmenta mucho los resultados de potenciales busquedas, ralentizando tiempos de ejecucion.
- Tiempos de actualizacion de datos. Si el webscrapping se hace segun el campo last_scraped, se puede intuir que solo se actualiza, como maximo, diariamente a las 6.00 am. Ademas, las fechas de ultimo scraping para cada item invita a pensar que algunos se actualizan con una frecuencia mensual.
```

## Obligatorio

Esta es la parte mínima que tendrás que entregar para superar este laboratorio.

### Consultas

- Saca en una consulta cuantos alojamientos hay en España.

```js
db.listingsAndReviews.countDocuments({ "address.country": "Spain" });
```

- Lista los 10 primeros:
  - Ordenados por precio de forma ascendente.
  - Sólo muestra: nombre, precio, camas y la localidad (`address.market`).

```js
db.listingsAndReviews
  .find({}, { name: 1, price: 1, beds: 1, "address.market": 1 })
  .sort({ price: 1 })
  .limit(10);
```

### Filtrando

- Queremos viajar cómodos, somos 4 personas y queremos:
  - 4 camas.
  - Dos cuartos de baño o más.
  - Sólo muestra: nombre, precio, camas y baños.

```js
db.listingsAndReviews.find(
  { beds: { $gte: 4 }, bathrooms: { $gte: 2 } },
  { name: 1, price: 1, beds: 1, bathrooms: 1, _id: 0 }
);
```

- Aunque estamos de viaje no queremos estar desconectados, así que necesitamos que el alojamiento también tenga conexión wifi. A los requisitos anteriores, hay que añadir que el alojamiento tenga wifi.
  - Sólo muestra: nombre, precio, camas, baños y servicios (`amenities`).

```js
db.listingsAndReviews.find(
  { beds: { $gte: 4 }, bathrooms: { $gte: 2 }, amenities: /wifi/i },
  { name: 1, price: 1, beds: 1, bathrooms: 1, amenities: 1, _id: 0 }
);
```

- Y bueno, un amigo trae a su perro, así que tenemos que buscar alojamientos que permitan mascota (_Pets allowed_).
  - Sólo muestra: nombre, precio, camas, baños y servicios (`amenities`).

```js
db.listingsAndReviews.find(
  {
    beds: { $gte: 4 },
    bathrooms: { $gte: 2 },
    amenities: /wifi/i,
    amenities: /Pets Allowed/i,
  },
  { name: 1, price: 1, beds: 1, bathrooms: 1, amenities: 1, _id: 0 }
);
```

- Estamos entre ir a Barcelona o a Portugal, los dos destinos nos valen. Pero queremos que el precio nos salga baratito (50 $), y que tenga buen rating de reviews (campo `review_scores.review_scores_rating` igual o superior a 88).
  - Sólo muestra: nombre, precio, camas, baños, rating y localidad.

```js
db.listingsAndReviews.find(
  {
    $or: [{ "address.country": "Portugal" }, { "address.market": "Barcelona" }],
    price: { $lt: 50 },
    "review_scores.review_scores_rating": { $gte: 88 },
  },
  {
    name: 1,
    price: 1,
    beds: 1,
    bathrooms: 1,
    "review_scores.review_scores_rating": 1,
    "address.market": 1,
    _id: 0,
  }
);
```

- También queremos que el huésped sea un superhost (`host.host_is_superhost`) y que no tengamos que pagar depósito de seguridad (`security_deposit`).
  - Sólo muestra: nombre, precio, camas, baños, rating, si el huésped es superhost, depósito de seguridad y localidad.

```js
db.listingsAndReviews.find(
  {
    $or: [{ "address.country": "Portugal" }, { "address.market": "Barcelona" }],
    price: { $lt: 50 },
    "review_scores.review_scores_rating": { $gte: 88 },
    "host.host_is_superhost": true,
    $or: [
      { security_deposit: 0 },
      { security_deposit: null },
      { security_deposit: undefined },
      { security_deposit: { $exists: false } },
    ],
  },
  {
    name: 1,
    price: 1,
    beds: 1,
    bathrooms: 1,
    "review_scores.review_scores_rating": 1,
    "address.market": 1,
  }
);
```

### Agregaciones

- Queremos mostrar los alojamientos que hay en España, con los siguientes campos:
  - Nombre.
  - Localidad (no queremos mostrar un objeto, sólo el string con la localidad).
  - Precio

```js
db.listingsAndReviews.aggregate([
  { $match: { "address.country": "Spain" } },
  { $project: { name: 1, market: "$address.market", price: 1, _id: 0 } },
]);
```

- Queremos saber cuantos alojamientos hay disponibles por pais.

```js
db.listingsAndReviews.aggregate([
  { $group: { _id: "$address.country", count: { $sum: 1 } } },
]);
```

## Opcional

- Queremos saber el precio medio de alquiler de airbnb en España.

```js
db.listingsAndReviews.aggregate([
  { $match: { "address.country": "Spain" } },
  { $group: { _id: "$address.country", AvgPrice: { $avg: "$price" } } },
]);
```

- ¿Y si quisieramos hacer como el anterior, pero sacarlo por paises?

```js
db.listingsAndReviews.aggregate([
  { $group: { _id: "$address.country", AvgPrice: { $avg: "$price" } } },
]);
```

- Repite los mismos pasos pero agrupando también por numero de habitaciones.

```js
db.listingsAndReviews.aggregate([
  {
    $group: {
      _id: { country: "$address.country", beds: "$beds" },
      AvgPrice: { $avg: "$price" },
    },
  },
  { $sort: { "_id.country": 1, "_id.beds": 1 } },
]);
```

## Desafio

Queremos mostrar el top 5 de alojamientos más caros en España, con los siguentes campos:

- Nombre.
- Precio.
- Número de habitaciones
- Número de camas
- Número de baños
- Ciudad.
- Servicios, pero en vez de un array, un string con todos los servicios incluidos.

```js
db.listingsAndReviews.aggregate([
  { $match: { "address.country": "Spain" } },
  {
    $project: {
      _id: 0,
      name: 1,
      price: 1,
      bedrooms: "$bedrooms",
      beds: "$beds",
      bathrooms: "$bathrooms",
      city: "$address.market",
      services: {
        $reduce: {
          input: "$amenities",
          initialValue: "",
          in: {
            $concat: [
              "$$value",
              { $cond: [{ $eq: ["$$value", ""] }, "", ", "] },
              "$$this",
            ],
          },
        },
      },
    },
  },
  { $sort: { price: -1 } },
  { $limit: 5 },
]);
```
