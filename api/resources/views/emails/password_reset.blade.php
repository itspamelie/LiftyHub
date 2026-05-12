<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta name="color-scheme" content="light dark"/>
  <meta name="supported-color-schemes" content="light dark"/>
  <title>Recuperacion de contrasena</title>
  <style>
    [data-ogsc] .e-outer  { background-color:#0d0d1f !important; }
    [data-ogsc] .e-header { background-color:#1a1a35 !important; }
    [data-ogsc] .e-body   { background-color:#161630 !important; }
    [data-ogsc] .e-card   { background-color:#0d0d22 !important; }
    [data-ogsc] .e-warn   { background-color:#1a1200 !important; }
    [data-ogsc] .e-footer { background-color:#0a0a18 !important; }
    [data-ogsc] .e-blue   { background-color:#3B82F6 !important; }
    [data-ogsc] .e-h1     { color:#e8e8ff !important; }
    [data-ogsc] .e-p      { color:#7777aa !important; }
    [data-ogsc] .e-white  { color:#ffffff !important; }
    [data-ogsc] .e-accent { color:#3B82F6 !important; }
    [data-ogsc] .e-code   { color:#e8e8ff !important; }
    [data-ogsc] .e-valid  { color:#6688aa !important; }
    [data-ogsc] .e-hint   { color:#4a5a7a !important; }
    [data-ogsc] .e-warn-text { color:#8a6a20 !important; }
    [data-ogsc] .e-dim    { color:#3a3a58 !important; }
    [data-ogsc] .e-dimmer { color:#252540 !important; }
    [data-ogsc] .e-sub    { color:#4a4a70 !important; }
  </style>
</head>
<body bgcolor="#0d0d1f" style="margin:0;padding:0;background-color:#0d0d1f;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0d0d1f" style="background-color:#0d0d1f;">
  <tr>
    <td class="e-outer" bgcolor="#0d0d1f" style="background-color:#0d0d1f;padding:32px 16px;" align="center">

      <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0d0d1f" style="max-width:540px;background-color:#0d0d1f;">

        <!-- LOGO HEADER -->
        <tr>
          <td class="e-header" bgcolor="#1a1a35" style="background-color:#1a1a35;border-radius:14px 14px 0 0;padding:28px 36px 22px;" align="center">
            <img src="https://api.liftyhub.com/logo/logo.jpg" alt="LiftyHub" width="120" style="display:block;border-radius:16px;"/>
            <p class="e-sub" style="margin:10px 0 0;font-size:10px;color:#4a4a70;letter-spacing:3px;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">Recuperacion de contrasena</p>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td class="e-body" bgcolor="#161630" style="background-color:#161630;padding:36px 36px 24px;" align="center">
            <h1 class="e-h1" style="margin:0 0 10px;font-size:24px;font-weight:800;color:#e8e8ff;font-family:Arial,Helvetica,sans-serif;">Hola, {{ $userName }}</h1>
            <p class="e-p" style="margin:0;font-size:14px;color:#7777aa;line-height:22px;font-family:Arial,Helvetica,sans-serif;">Recibimos una solicitud para restablecer<br>tu contrasena. Usa el codigo de abajo.</p>
          </td>
        </tr>

        <!-- CODIGO -->
        <tr>
          <td class="e-body" bgcolor="#161630" style="background-color:#161630;padding:0 36px 24px;" align="center">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="e-card" bgcolor="#0d0d22" style="background-color:#0d0d22;border-radius:10px;border:1px solid #2a3a5a;padding:26px 20px;" align="center">
                  <p class="e-accent" style="margin:0 0 10px;font-size:10px;font-weight:700;color:#3B82F6;text-transform:uppercase;letter-spacing:3px;font-family:Arial,Helvetica,sans-serif;">Codigo de verificacion</p>
                  <p class="e-code" style="margin:0;font-size:42px;font-weight:900;color:#e8e8ff;letter-spacing:12px;font-family:'Courier New',Courier,monospace;">{{ $tempPassword }}</p>
                  <p class="e-hint" style="margin:10px 0 0;font-size:12px;color:#4a5a7a;font-family:Arial,Helvetica,sans-serif;">Valido por <span class="e-valid" style="color:#6688aa;font-weight:700;">15 minutos</span> &nbsp;·&nbsp; Un solo uso</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- AVISO -->
        <tr>
          <td class="e-body" bgcolor="#161630" style="background-color:#161630;padding:0 36px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="e-warn" bgcolor="#1a1200" style="background-color:#1a1200;border:1px solid #3a2a00;border-radius:8px;padding:12px 16px;">
                  <p class="e-warn-text" style="margin:0;font-size:12px;color:#8a6a20;line-height:18px;font-family:Arial,Helvetica,sans-serif;">Si no solicitaste este codigo, ignora este correo. Tu contrasena no cambiara.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td class="e-body" bgcolor="#161630" style="background-color:#161630;padding:4px 36px 36px;" align="center">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td class="e-blue" bgcolor="#3B82F6" style="background-color:#3B82F6;border-radius:8px;padding:13px 40px;">
                  <span class="e-white" style="font-size:14px;font-weight:700;color:#ffffff;font-family:Arial,Helvetica,sans-serif;">Abrir LiftyHub</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td class="e-footer" bgcolor="#0a0a18" style="background-color:#0a0a18;border-radius:0 0 14px 14px;padding:18px 36px 22px;" align="center">
            <p class="e-dim" style="margin:0;font-size:12px;color:#3a3a58;font-family:Arial,Helvetica,sans-serif;">Dudas: <a href="mailto:liftyhubofficial@gmail.com" class="e-accent" style="color:#3B82F6;text-decoration:none;">liftyhubofficial@gmail.com</a></p>
            <p class="e-dimmer" style="margin:8px 0 0;font-size:11px;color:#252540;font-family:Arial,Helvetica,sans-serif;">© {{ date('Y') }} LiftyHub. Todos los derechos reservados.</p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>
