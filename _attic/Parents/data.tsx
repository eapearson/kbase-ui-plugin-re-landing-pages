import React from 'react';
import ParentsDB, { ParentsDBStateLoaded } from './ParentsDB';
import { DBStatus, DBStateError } from '../../../lib/DB';
import { AppConfig } from '@kbase/ui-components';
import View from './view';
import { Icon } from 'antd';
import ErrorView from '../../../components/ErrorView';
import { OntologyReference } from '../../../types/ontology';

export interface Props {
    token: string;
    config: AppConfig;
    termRef: OntologyReference;
    selectedTermRef: OntologyReference | null;
    selectTerm: (termRef: OntologyReference) => void;
    // taxonID: TaxonID;
    navigateToTermRef: (termRef: OntologyReference) => void;
}

interface State { }

export default class Data extends React.Component<Props, State> {
    db: ParentsDB;
    currentlyNavigatedOntologyRef: OntologyReference | null;
    constructor(props: Props) {
        super(props);
        this.db = new ParentsDB({
            onUpdate: () => {
                this.forceUpdate();
            },
            initialData: {
                status: DBStatus.NONE
            },
            token: props.token,
            config: props.config
        });
        this.currentlyNavigatedOntologyRef = null;
    }

    navigateToTerm(termRef: OntologyReference) {
        return this.props.navigateToTermRef(termRef);
    }

    renderLoading() {
        return <Icon type="loading" />;
    }

    renderError(db: DBStateError) {
        // NB this is rendered raw in the container, which is a flex row.
        return (
            <div className="Col">
                <div style={{ width: '50%', margin: '20px auto 0 auto' }}>
                    <ErrorView error={db.error} />
                </div>
            </div>
        );
    }

    renderLoaded(db: ParentsDBStateLoaded) {
        return (
            <View
                terms={db.terms}
                selectedTermRef={this.props.selectedTermRef}
                selectTerm={this.props.selectTerm.bind(this)}
                navigateToTermRef={this.props.navigateToTermRef.bind(this)}
            />
        );
    }

    componentDidMount() {
        this.db.getParentTerms(this.props.termRef);
    }

    componentDidUpdate(previousProps: Props) {
        // if (previousProps.termRef.id !== this.props.termRef.id ||
        //     previousProps.termRef.timestamp !== this.props.termRef.timestamp) {
        //     this.db.getTargetTerm(this.props.termRef);
        // }
    }

    render() {
        const db = this.db.get();
        switch (db.status) {
            case DBStatus.NONE:
                // this.db.getTargetTaxon(this.props.taxonID);
                return this.renderLoading();
            case DBStatus.LOADING:
                return this.renderLoading();
            case DBStatus.ERROR:
                return this.renderError(db);
            case DBStatus.LOADED:
                return this.renderLoaded(db);
            // if (this.props.taxonID !== db.targetTaxon.id) {
            //     this.db.getTargetTaxon(this.props.taxonID);
            //     return this.renderLoaded(db);
            // } else {
            //     return this.renderLoaded(db);
            // }
        }
    }
}
