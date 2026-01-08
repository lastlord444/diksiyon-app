# Diksiyon App

Diksiyon ve telaffuz geliştirme uygulaması. [Next.js](https://nextjs.org) ile geliştirilmiştir.

## Geliştirme

Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) adresinden uygulamaya erişebilirsiniz.

## Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Linting
npm run lint

# TypeScript tip kontrolü
npm run typecheck
```

## Health Check

Uygulamanın sağlık durumunu kontrol etmek için API endpoint'i:

```bash
# Servis sağlığını kontrol et
curl http://localhost:3000/api/health
```

**Environment Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Bu endpoint hem environment variable'ların varlığını hem de Supabase bağlantısını doğrular.

## DB Kurulum

Supabase veritabanı şemasını kurmak için:

1. Supabase Dashboard'da **SQL Editor** açın
2. [`supabase/schema.sql`](supabase/schema.sql) dosyasının tamamını kopyalayın
3. SQL Editor'a yapıştırıp **RUN** edin
4. `exercises` (3 örnek egzersiz) ve `attempts` tabloları oluşturulacak
5. RLS policies otomatik aktifleşir (anon read + authenticated user-specific access)

## Özellikler

- ⚡ Next.js 16 App Router
- 🎨 Tailwind CSS v4
- 📝 TypeScript desteği
- 🔍 ESLint yapılandırması
- 🌓 Dark/Light mode
- 📱 Responsive tasarım
- 🚀 Vercel deploy hazır

## Geliştirme Notları

Uygulama [`src/app/page.tsx`](src/app/page.tsx) dosyasını düzenleyerek özelleştirilebilir. Değişiklikler otomatik olarak yansır.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Geliştirme Kuralları

- **Line endings:** LF zorunlu (CRLF kullanmayın)
- **Charset:** UTF-8 encoding gerekli
- **EditorConfig:** `.editorconfig` dosyasına uyun (indent: 2 spaces)
- **Windows kullanıcıları:** Git'in otomatik CRLF dönüşümünü devre dışı bırakın
- **Kod formatı:** TypeScript/JavaScript için 2 space indent
- **Trailing whitespace:** Markdown haricinde temizlenmelidir

```bash
# Windows'ta CRLF dönüşümünü devre dışı bırak
git config core.autocrlf false
```
