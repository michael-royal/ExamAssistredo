        const fidt = document.querySelectorAll('.ic'),
            visi = document.querySelectorAll('.cci'),
            skil = document.getElementById('signupPassword'),
            skill = document.getElementById('confirmPassword'),
            skille = document.getElementById('loginPassword')

  let PassVisible = false;
        // ClearVisi()
// eventlistener to makevisible or not

fidt.forEach((ic) =>{
    ic.addEventListener('click', ()=>{
 if (!PassVisible) {
        PassVisible = true;
        skil.setAttribute('type','password')
        skill.setAttribute('type','password')
        skille.setAttribute('type','password')
        visi[0].classList.add('d-none')
        visi[2].classList.add('d-none')
        visi[4].classList.add('d-none')
        visi[1].classList.remove('d-none')
        visi[3].classList.remove('d-none')
        visi[5].classList.remove('d-none')
    }else{
        PassVisible = false
        skil.setAttribute('type','input')
        skill.setAttribute('type','input')
        skille.setAttribute('type','input')
        visi[0].classList.remove('d-none')
        visi[2].classList.remove('d-none')
        visi[4].classList.remove('d-none')
        visi[1].classList.add('d-none')
        visi[3].classList.add('d-none')
        visi[5].classList.add('d-none')
    }
    })
})
