import { Component, OnInit } from '@angular/core';
import { EnderecoService } from '../../services/endereco.service';
import { MsgService } from '../../services/msg.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Endereco } from '../../models/endereco';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-endereco-add',
  templateUrl: './endereco-add.page.html',
  styleUrls: ['./endereco-add.page.scss'],
})
export class EnderecoAddPage implements OnInit {

  endereco: Endereco = new Endereco();
  userkey: string = null;
  key:string = null;

  constructor(
    private enderecoService: EnderecoService,
    protected msg: MsgService,
    private router: Router,
    private activadeRouter: ActivatedRoute,
    private auth:AngularFireAuth
  ) { }

  ngOnInit() {
    this.key = this.activadeRouter.snapshot.paramMap.get('key');
    this.userkey = this.activadeRouter.snapshot.paramMap.get('userkey');
    this.endereco.userkey = this.userkey; 
    this.getEndereco(this.key)
  }

  async getEndereco(key) {
    if (key) {
      await this.enderecoService.get(key).subscribe(
        res => {
          this.endereco = res;
          return true;
        },
        error => {
          console.log("ERRO:", error);
          return false;
        }
      )
    }
  }

  buscaCEP() {
    this.enderecoService.pegaCEP(this.endereco.cep).subscribe(
      res => {
        console.log(res);
        if (res.erro) {
          this.msg.presentToast("CEP não localizado!");
        } else {
          this.endereco.logradouro = res.logradouro;
          this.endereco.localidade = res.localidade;
          this.endereco.bairro = res.bairro;
          this.endereco.uf = res.uf;
        }
      },
      error => {
        console.error(error)
      }
    )
  }


  salvar() {
      this.msg.presentLoading();  
      this.enderecoService.add(this.endereco).then(
        res => {
          console.log('Dados Salvos firebase...', res);
          this.msg.dismissLoading();
          this.msg.presentAlert('Aviso', 'Enderteço Cadastrado.');
          this.endereco = new Endereco();
          this.router.navigate(['/tabs/enderecoconf']);
        },
        error => {
          console.error("Erro ao salvar.", error);
          this.msg.dismissLoading();
          this.msg.presentAlert("Error", "Não foi possivel salvar.");
        }
      )
        
    }
  
  }

      

    


        
             
      
   