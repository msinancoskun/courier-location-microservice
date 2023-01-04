# Courier Location Microservice
Proje dockerize edilmiştir, çalıştırmak için bu komutu kullanabilirsiniz.
```bash
docker-compose up
```

## Task
>KURYE POC ÇALIŞMASI
<br />
Bir kurye şirketinde 10.000 kurye çalışanı olduğunu düşünün. Kuryelerin lokasyon bilgilerini toplamak için back-end tarafında bir mikroservis tasarlanması isteniyor.
Bu mikroservis nodejs (typescript) ile ve nestjs frameworkü kullanılarak geliştirilmeli. Lokasyon bilgileri mongodb’de tutulmalı.
Lokasyon requestinin yoğun bir şekilde kurye başına her saniyede bir geldiğini düşünün (not: kurye lokasyon bilgilerinin insert sırası bozulmamalı – istekler sıraya alınmalı).
Bu servis crud işlemlerinin
yapılabilmesi için endpoint sağlamalı, istenen endpoint listesi aşağıdadır. Swagger entegrasyonu olmalıdır. Crud işlemlerinde databasin önüne cache yapısı olarak redis kullanılmalıdır.
Bu çalışmanın ekstra konfigürasyon gerektirmeden (manuel db kurulumu vs) çalışıyor olması
beklenmektedir (dockerize edilmeli) . Kuryelerden gelecek veriler aşağıdaki gibi olmalıdır.
{courierId,latitude,longitude}
Endpoints:
/courier/save-courier-location
/courier/get-courier-last-location/{courierId}
/courier/get-all-couriers-last-location
Not: Bu proje github üzerinden teslim edilmeli.