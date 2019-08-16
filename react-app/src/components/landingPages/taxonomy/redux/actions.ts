import { Action, Dispatch } from 'redux';
import { Taxon, TaxonID, TaxonomyStoreState } from './store';
import { TaxonomyModel } from '../lib/model';
import { StoreState } from '../../../../redux/store';

/**
 * All of our lovely action types :)
 */
export enum TaxonomyActionType {
    LOAD,
    LOAD_START,
    LOAD_SUCCESS,
    LOAD_ERROR,
    UNLOAD,
    SELECT_TAXON,
    SELECT_TAXON_START,
    SELECT_TAXON_SUCCESS,
    SELECT_TAXON_ERROR,
    SEARCH_CHILDREN,
    SEARCH_CHILDREN_START,
    SEARCH_CHILDREN_SUCCESS,
    SEARCH_CHILDREN_ERROR
}

/**
 * Action Types
 */

export interface Load extends Action<TaxonomyActionType.LOAD> {
    type: TaxonomyActionType.LOAD;
}

export interface LoadStart extends Action<TaxonomyActionType.LOAD_START> {
    type: TaxonomyActionType.LOAD_START;
}

export interface LoadSuccess extends Action<TaxonomyActionType.LOAD_SUCCESS> {
    type: TaxonomyActionType.LOAD_SUCCESS;
    // lineage: Array<Taxon>;
    // offspring: Array<Taxon>;
    selectedTaxonID: TaxonID;
    selectedTaxon: Taxon;
    targetTaxon: Taxon;
}

export interface LoadError extends Action<TaxonomyActionType.LOAD_ERROR> {
    type: TaxonomyActionType.LOAD_ERROR;
    message: string;
}

export interface Unload extends Action<TaxonomyActionType.UNLOAD> {
    type: TaxonomyActionType.UNLOAD;
}

/**
 * Action Generators
 */

export function loadStart(): LoadStart {
    return {
        type: TaxonomyActionType.LOAD_START
    };
}

export function loadError(message: string): LoadError {
    return {
        type: TaxonomyActionType.LOAD_ERROR,
        message
    };
}

export function loadSuccess(selectedTaxonID: TaxonID, selectedTaxon: Taxon, targetTaxon: Taxon): LoadSuccess {
    return {
        type: TaxonomyActionType.LOAD_SUCCESS,
        selectedTaxonID,
        selectedTaxon,
        targetTaxon
    };
}

export function unload() {
    return {
        type: TaxonomyActionType.UNLOAD
    };
}

/**
 * Thunks
 */

export function load(taxonID: TaxonID) {
    return async (dispatch: Dispatch<Action>, getState: () => StoreState) => {
        dispatch(loadStart());

        const {
            auth: { userAuthorization },
            app: {
                config: {
                    services: {
                        ServiceWizard: { url: serviceWizardURL }
                    }
                }
            }
        } = getState();

        if (!userAuthorization) {
            dispatch(loadError('Taxonomy may only start with authentication'));
            return;
        }

        const { token } = userAuthorization;

        const client = new TaxonomyModel({
            token: token,
            url: serviceWizardURL
            // url: 'http://localhost:3001/services/service_wizard'
        });
        // const lineage = await client.getLineage(taxonID);

        // const [offspring, totalCount] = await client.getChildren(taxonID, { offset: 0, limit: 10 });
        const targetTaxon = await client.getTaxon(taxonID);

        dispatch(loadSuccess(taxonID, targetTaxon, targetTaxon));
    };
}

/**
 * Taxon Selection actions
 */

export interface SelectTaxon {
    type: TaxonomyActionType.SELECT_TAXON;
    taxonID: TaxonID;
}

interface SelectTaxonStart {
    type: TaxonomyActionType.SELECT_TAXON_START;
}

interface SelectTaxonError {
    type: TaxonomyActionType.SELECT_TAXON_ERROR;
    message: string;
}

interface SelectTaxonSuccess {
    type: TaxonomyActionType.SELECT_TAXON_SUCCESS;
    taxon: Taxon;
}

/**
 * Taxon selection action generators
 */

function selectTaxonStart(): SelectTaxonStart {
    return {
        type: TaxonomyActionType.SELECT_TAXON_START
    };
}

function selectTaxonError(message: string): SelectTaxonError {
    return {
        type: TaxonomyActionType.SELECT_TAXON_ERROR,
        message
    };
}

function selectTaxonSuccess(taxon: Taxon): SelectTaxonSuccess {
    return {
        type: TaxonomyActionType.SELECT_TAXON_SUCCESS,
        taxon
    };
}

/**
 * Thunks
 */

export function selectTaxon(taxonID: TaxonID) {
    return async (dispatch: Dispatch<Action>, getState: () => StoreState) => {
        dispatch(selectTaxonStart());

        const {
            auth: { userAuthorization },
            app: {
                config: {
                    services: {
                        ServiceWizard: { url: serviceWizardURL }
                    }
                }
            }
        } = getState();

        if (!userAuthorization) {
            dispatch(selectTaxonError('Taxonomy may only start with authentication'));
            return;
        }

        const { token } = userAuthorization;

        const client = new TaxonomyModel({
            token: token,
            url: serviceWizardURL
        });

        try {
            const taxon = await client.getTaxon(taxonID);
            dispatch(selectTaxonSuccess(taxon));
        } catch (ex) {
            dispatch(selectTaxonError(ex.message));
        }
    };
}