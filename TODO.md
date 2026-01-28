# Todo

- [x] create a new project
- [x] api Anbindung pokemon api (Flavio)
- [x] Navigation anpassen, und für master Detail Vorbeiten (Christoph)
- [ ] Theme Anlegen / anpassen (dark mode, light mode)
- [x] Badge für Typ des Pokemons (Marvin)
- [x] Components fürs Bild (Marin)

Future

- [ ] List der Pokemons
- [ ] Detail Navigation anpassen
- [ ] Anzeige eines Pokemons

Ideen:

- [ ] more Persistieren / Cachen
- [ ] Favorite Makieren
- [ ] Widget


Infinit Query:
```typescript
useInfiniteQuery({
  queryKey: ["items"],
  initialPageParam: 1,
  queryFn: ({ pageParam }) => fetchItemsPage({ page: pageParam, limit: 20 }),
  getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
});
```

Ui idee: UI mit FlashList (oder FlatList)