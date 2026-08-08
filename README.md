# IMvester — nova experiência digital

Redesign responsivo da página institucional da IMvester, preservando os conteúdos e destinos dos CTAs do site atual.

## Tecnologias

- React + TypeScript
- Vite
- Framer Motion
- Lucide React
- CSS responsivo com suporte a `prefers-reduced-motion`

## Rodar localmente

```bash
npm install
npm run dev
```

Para validar a versão de produção:

```bash
npm run lint
npm run build
```

## Integrações preservadas

- WhatsApp: `+55 (11) 91175-2888`
- E-mail: `ativacao@imvester.com.br`
- Instagram: `@imvester.br`
- Trabalhe conosco: `https://rhimvester.lovable.app/trabalhe-conosco`

Os destinos ficam centralizados em `src/content.ts` para facilitar futuras mudanças.

## Formulário

O formulário do site público anterior não possuía uma API de envio real. Nesta versão, a interface e as validações foram mantidas, mas nenhum dado é transmitido até a conexão de um endpoint seguro. O usuário recebe essa informação de forma explícita e pode seguir pelo WhatsApp.

## Visual principal

O hero usa uma composição arquitetônica original gerada para o projeto e otimizada em WebP. As demais imagens foram copiadas dos assets públicos da própria marca para evitar hotlinks frágeis.

