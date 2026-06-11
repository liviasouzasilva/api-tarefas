# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Gerenciador de Tarefas (integração com o backend)

Este frontend foi adaptado para consumir a API do backend presente na pasta `backend/`.

### Como rodar (resumo)

1. No backend (terminal 1):
```
cd backend
npm install
npm run dev
```

2. No frontend (terminal 2):
```
cd frontend
npm install
npm run dev
```

3. Abra o endereço mostrado pelo Vite (ex.: `http://localhost:5173`).

### Configuração da API

Por padrão o frontend consulta `http://localhost:3000`. Para alterar, defina `VITE_API_URL` em um arquivo `.env` no diretório `frontend`.

### Scripts úteis (backend)

- `backend/scripts/create_database.js` — cria o banco `tarefas_db` localmente (XAMPP/MySQL).
- `backend/scripts/test_api.js` — executa um fluxo CRUD automático para validar a API.

Se precisar que eu melhore a UI (filtros, paginação, busca) ou empacote a aplicação para produção, me avise.
