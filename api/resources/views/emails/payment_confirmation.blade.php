<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta name="color-scheme" content="light dark"/>
  <meta name="supported-color-schemes" content="light dark"/>
  <title>Pago confirmado</title>
  <style>
    [data-ogsc] .e-outer  { background-color:#0d0d1f !important; }
    [data-ogsc] .e-header { background-color:#1a1a35 !important; }
    [data-ogsc] .e-body   { background-color:#161630 !important; }
    [data-ogsc] .e-card   { background-color:#0d0d22 !important; }
    [data-ogsc] .e-footer { background-color:#0a0a18 !important; }
    [data-ogsc] .e-blue   { background-color:#3B82F6 !important; }
    [data-ogsc] .e-h1     { color:#e8e8ff !important; }
    [data-ogsc] .e-p      { color:#7777aa !important; }
    [data-ogsc] .e-white  { color:#ffffff !important; }
    [data-ogsc] .e-accent { color:#3B82F6 !important; }
    [data-ogsc] .e-val    { color:#e8e8ff !important; }
    [data-ogsc] .e-label  { color:#7777aa !important; }
    [data-ogsc] .e-green  { color:#22c55e !important; }
    [data-ogsc] .e-dim    { color:#3a3a58 !important; }
    [data-ogsc] .e-dimmer { color:#252540 !important; }
    [data-ogsc] .e-sub    { color:#4a4a70 !important; }
    [data-ogsc] .e-sep    { background-color:#1e1e3a !important; }
    [data-ogsc] .e-name   { color:#e8e8ff !important; }
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
            <p class="e-sub" style="margin:10px 0 0;font-size:10px;color:#4a4a70;letter-spacing:3px;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">Confirmacion de pago</p>
          </td>
        </tr>

        <!-- HERO -->
        <tr>
          <td class="e-body" bgcolor="#161630" style="background-color:#161630;padding:36px 36px 24px;" align="center">
            <h1 class="e-h1" style="margin:0 0 10px;font-size:24px;font-weight:800;color:#e8e8ff;font-family:Arial,Helvetica,sans-serif;">Pago exitoso</h1>
            <p class="e-p" style="margin:0;font-size:14px;color:#7777aa;line-height:22px;font-family:Arial,Helvetica,sans-serif;">Hola <span class="e-name" style="color:#e8e8ff;font-weight:700;">{{ $userName }}</span>, tu pago fue procesado.<br>Tu plan ya esta activo.</p>
          </td>
        </tr>

        <!-- RESUMEN -->
        <tr>
          <td class="e-body" bgcolor="#161630" style="background-color:#161630;padding:0 36px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td colspan="2" class="e-blue" bgcolor="#3B82F6" style="background-color:#3B82F6;border-radius:8px 8px 0 0;padding:10px 16px;">
                  <p class="e-white" style="margin:0;font-size:10px;font-weight:700;color:#ffffff;text-transform:uppercase;letter-spacing:2px;font-family:Arial,Helvetica,sans-serif;">Resumen de compra</p>
                </td>
              </tr>
              <tr>
                <td class="e-card" bgcolor="#0d0d22" style="background-color:#0d0d22;padding:12px 16px;border-bottom:1px solid #1e1e3a;">
                  <span class="e-label" style="font-size:13px;color:#7777aa;font-family:Arial,Helvetica,sans-serif;">Plan adquirido</span>
                </td>
                <td class="e-card" bgcolor="#0d0d22" style="background-color:#0d0d22;padding:12px 16px;border-bottom:1px solid #1e1e3a;text-align:right;">
                  <span class="e-val" style="font-size:13px;font-weight:700;color:#e8e8ff;font-family:Arial,Helvetica,sans-serif;">Plan {{ $planName }}</span>
                </td>
              </tr>
              <tr>
                <td class="e-card" bgcolor="#0d0d22" style="background-color:#0d0d22;padding:12px 16px;border-bottom:1px solid #1e1e3a;">
                  <span class="e-label" style="font-size:13px;color:#7777aa;font-family:Arial,Helvetica,sans-serif;">Monto pagado</span>
                </td>
                <td class="e-card" bgcolor="#0d0d22" style="background-color:#0d0d22;padding:12px 16px;border-bottom:1px solid #1e1e3a;text-align:right;">
                  <span class="e-val" style="font-size:13px;font-weight:700;color:#e8e8ff;font-family:Arial,Helvetica,sans-serif;">{{ $planPrice }} MXN</span>
                </td>
              </tr>
              <tr>
                <td class="e-card" bgcolor="#0d0d22" style="background-color:#0d0d22;padding:12px 16px;border-radius:0 0 0 8px;">
                  <span class="e-label" style="font-size:13px;color:#7777aa;font-family:Arial,Helvetica,sans-serif;">Valido hasta</span>
                </td>
                <td class="e-card" bgcolor="#0d0d22" style="background-color:#0d0d22;padding:12px 16px;border-radius:0 0 8px 0;text-align:right;">
                  <span class="e-green" style="font-size:13px;font-weight:700;color:#22c55e;font-family:Arial,Helvetica,sans-serif;">{{ $endDate }}</span>
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
