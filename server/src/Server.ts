import { server } from './App';
import { keys } from './Config';

server.listen(keys.PORT, () => {
  console.log(`Now listening on Port: ${keys.PORT}`);
});
