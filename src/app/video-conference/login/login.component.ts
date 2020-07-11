import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, AuthenticationService } from '../services';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.loadScript('../../../assets/js/peer.js');
        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        var user ={id: 1, username: "prasanth", firstName: "a", lastName: "a", token: "fake-jwt-token"}
        localStorage.setItem('currentUser1', JSON.stringify(user));
        
        var user1 ={id: 1, username: "yogi", firstName: "a", lastName: "a", token: "fake-jwt-token"}
        localStorage.setItem('currentUser2', JSON.stringify(user1));
        // this.authenticationService.login(this.f.username.value, this.f.password.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
        // setTimeout( () =>{
            // this.loadScript('../../../assets/js/peer.js');
        // this.loadScript('../../../assets/js/peer-client.js');
        // this.loadScript('../../../assets/js/vue.js');
            this.router.navigate(['/home'],{ queryParams: { id: this.f.username.value } });
        //   }, 5000);
        
    }
    public loadScript(url) {
        let body = <HTMLDivElement> document.body;
        let script = document.createElement('script');
        script.innerHTML = '';
        script.src = url;
        script.async = true;
        script.defer = true;
        body.appendChild(script);
}
}
