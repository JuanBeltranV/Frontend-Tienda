import { $ } from './utils.js';

// Registro
export function initRegistro(){
    const form = $('#formRegistro');
    if (!form) return;

    const nombre = $('#nombre'), apellido = $('#apellido'), email = $('#email');
    const pass = $('#pass'), pass2 = $('#pass2'), tyc = $('#tyc');
    const errTyc = $('#errTyc'), msgOk = $('#msgOk');

    const setErr = (input, msg) => { input?.parentElement?.querySelector('.error')?.textContent = msg || ''; };
    const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validar(){
    let ok = true;
    if (!nombre.value.trim()) { setErr(nombre,'Ingresa tu nombre'); ok=false; } else setErr(nombre,'');
    if (!apellido.value.trim()) { setErr(apellido,'Ingresa tu apellido'); ok=false; } else setErr(apellido,'');
    if (!reEmail.test((email.value||'').trim())) { setErr(email,'Correo inválido'); ok=false; } else setErr(email,'');
    if (pass.value.length < 6) { setErr(pass,'Mínimo 6 caracteres'); ok=false; } else setErr(pass,'');
    if (pass2.value !== pass.value) { setErr(pass2,'No coinciden'); ok=false; } else setErr(pass2,'');
    if (!tyc.checked) { errTyc.textContent = 'Debes aceptar'; ok=false; } else errTyc.textContent = '';
    return ok;
    }

    form.addEventListener('submit', e=>{
    e.preventDefault();
    if (!validar()) return;
    const users = JSON.parse(localStorage.getItem('chetanga_users')||'[]');
    if (users.some(u=>u.email.toLowerCase()===email.value.trim().toLowerCase())){
        setErr(email,'Correo ya registrado'); return;
    }
    users.push({ nombre:nombre.value.trim(), apellido:apellido.value.trim(), email:email.value.trim(), pass:pass.value });
    localStorage.setItem('chetanga_users', JSON.stringify(users));
    form.reset(); msgOk.hidden=false;
    });
}

// Login
export function initLogin(){
    const form = $('#formLogin');
    if (!form) return;
    const email = $('#loginEmail'), pass = $('#loginPass');
    const err = $('#errLogin'), ok = $('#msgLoginOk');

    form.addEventListener('submit', e=>{
    e.preventDefault();
    const users=JSON.parse(localStorage.getItem('chetanga_users')||'[]');
    const user=users.find(u=>u.email.toLowerCase()===email.value.trim().toLowerCase() && u.pass===pass.value);
    if (!user){ err.textContent="Credenciales inválidas"; return; }
    err.textContent=""; ok.hidden=false;
    localStorage.setItem('chetanga_session',JSON.stringify(user));
    setTimeout(()=>location.href='index.html',1000);
    });
}

// Contacto
export function initContacto(){
    const form = $('#formContacto');
    if (!form) return;
    const msg = $('#msgContacto') || $('#msgContactoOk');
    form.addEventListener('submit', e=>{
    e.preventDefault();
    form.reset();
    if (msg){ msg.hidden=false; setTimeout(()=>{ msg.hidden=true; }, 2500); }
    });
}
